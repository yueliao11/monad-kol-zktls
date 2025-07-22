'use client'

import { useState, useCallback } from 'react'
import { PLATFORM_CONFIGS, type PlatformType } from '../lib/platform-config'
import { type VerificationResult } from '../lib/creator-platform-sdk'

export interface ZKTLSVerificationState {
  isLoading: boolean
  error: string | null
  result: VerificationResult | null
}

export function useMultiPlatformZKTLS() {
  const [verificationStates, setVerificationStates] = useState<Record<PlatformType, ZKTLSVerificationState>>({
    TWITTER: { isLoading: false, error: null, result: null },
    QUORA: { isLoading: false, error: null, result: null },
    MEDIUM: { isLoading: false, error: null, result: null },
    BINANCE: { isLoading: false, error: null, result: null },
    OKX: { isLoading: false, error: null, result: null }
  })

  const updateVerificationState = useCallback((platform: PlatformType, update: Partial<ZKTLSVerificationState>) => {
    setVerificationStates(prev => ({
      ...prev,
      [platform]: { ...prev[platform], ...update }
    }))
  }, [])

  const verifyPlatform = useCallback(async (platform: PlatformType, userAddress: string): Promise<VerificationResult> => {
    updateVerificationState(platform, { isLoading: true, error: null })

    try {
      // Dynamic import to avoid SSR issues
      const { PrimusZKTLS } = await import('@primuslabs/zktls-js-sdk')
      
      // Initialize Primus SDK
      const primusZKTLS = new PrimusZKTLS()
      
      // Get app config from API
      const configResponse = await fetch('/api/zktls/config')
      const { appId } = await configResponse.json()
      
      // Initialize with the new app ID for X Web3 KOL
      await primusZKTLS.init(appId)
      
      // Get platform configuration
      const platformConfig = PLATFORM_CONFIGS[platform]
      if (!platformConfig.templateId || platformConfig.templateId.startsWith('YOUR_')) {
        throw new Error(`${platform} template not configured yet`)
      }
      
      // Generate request parameters
      const request = primusZKTLS.generateRequestParams(platformConfig.templateId, userAddress)
      
      // Set additional parameters
      const additionParams = JSON.stringify({
        platform: platform.toLowerCase(),
        timestamp: Date.now()
      })
      request.setAdditionParams(additionParams)
      
      // Set attestation mode (proxy TLS by default)
      request.setAttMode({
        algorithmType: 'proxytls'
      })
      
      // Convert to JSON string
      const requestStr = request.toJsonString()
      
      // Get signed request from backend
      const signResponse = await fetch(`/api/zktls/sign?signParams=${encodeURIComponent(requestStr)}`)
      const signResult = await signResponse.json()
      
      if (!signResult.signResult) {
        throw new Error('Failed to sign request')
      }
      
      // Start attestation process
      const attestation = await primusZKTLS.startAttestation(signResult.signResult)
      
      // Verify attestation
      const isValid = await primusZKTLS.verifyAttestation(attestation)
      
      if (!isValid) {
        throw new Error('Attestation verification failed')
      }
      
      // Calculate preliminary score based on attestation data
      const score = calculatePlatformScore(platform, attestation.data)
      
      const result: VerificationResult = {
        success: true,
        attestation,
        score
      }
      
      updateVerificationState(platform, { isLoading: false, result })
      return result
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      updateVerificationState(platform, { isLoading: false, error: errorMessage })
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }, [updateVerificationState])

  const resetVerification = useCallback((platform: PlatformType) => {
    updateVerificationState(platform, { isLoading: false, error: null, result: null })
  }, [updateVerificationState])

  const getVerificationStatus = useCallback((platform: PlatformType) => {
    return verificationStates[platform]
  }, [verificationStates])

  const getOverallProgress = useCallback(() => {
    const states = Object.values(verificationStates)
    const completed = states.filter(state => state.result?.success).length
    const total = states.length
    const inProgress = states.some(state => state.isLoading)
    
    return {
      completed,
      total,
      percentage: (completed / total) * 100,
      inProgress
    }
  }, [verificationStates])

  return {
    verificationStates,
    verifyPlatform,
    resetVerification,
    getVerificationStatus,
    getOverallProgress
  }
}

function calculatePlatformScore(platform: PlatformType, data: string): number {
  try {
    const parsedData = JSON.parse(data)
    
    switch (platform) {
      case 'TWITTER':
        return Math.min(
          (parsedData.followers || 0) * 0.1 + 
          (parsedData.posts || 0) * 1 + 
          (parsedData.likes || 0) * 0.02,
          1000
        )
      case 'QUORA':
        return Math.min(
          (parsedData.followers || 0) * 0.2 + 
          (parsedData.answers || 0) * 2 + 
          (parsedData.upvotes || 0) * 0.1,
          1000
        )
      case 'MEDIUM':
        return Math.min(
          (parsedData.followers || 0) * 0.2 + 
          (parsedData.posts || 0) * 2 + 
          (parsedData.claps || 0) * 0.05,
          1000
        )
      case 'BINANCE':
      case 'OKX':
        return 500 // Base score for verified exchange accounts
      default:
        return 100
    }
  } catch {
    return 100
  }
}