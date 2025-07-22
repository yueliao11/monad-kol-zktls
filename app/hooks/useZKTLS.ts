import { useState, useCallback } from 'react'
import { primusSDK } from '@/lib/primus-sdk'
import type { AttestationResult, VerificationResult } from '@/lib/primus-sdk'

export interface UseZKTLSReturn {
  isLoading: boolean
  error: string | null
  attestation: AttestationResult | null
  verificationResult: VerificationResult | null
  verifyTwitter: (userAddress: string) => Promise<void>
  startZKTLSVerification: (params: { 
    type: string; 
    platform: string; 
    templateId: string; 
    dataSource?: string; 
    requestUrl?: string; 
    dataItems?: any 
  }) => Promise<{ success: boolean; attestation?: any }>
  reset: () => void
}

export function useZKTLS(): UseZKTLSReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attestation, setAttestation] = useState<AttestationResult | null>(null)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)

  const verifyTwitter = useCallback(async (userAddress: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Initialize SDK and verify Twitter
      const result = await primusSDK.verifyTwitter(userAddress)
      setVerificationResult(result)
      
      if (result.success && result.attestation) {
        setAttestation(result.attestation)
      } else {
        throw new Error(result.error || 'Twitter verification failed')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(message)
      console.error('Twitter verification error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const startZKTLSVerification = useCallback(async (params: { 
    type: string; 
    platform: string; 
    templateId: string; 
    dataSource?: string; 
    requestUrl?: string; 
    dataItems?: any 
  }) => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Starting zkTLS verification:', params)
      
      // Get user wallet address
      const accounts = window.ethereum ? (await window.ethereum.request({ method: 'eth_accounts' })) : []
      const userAddress = accounts[0]
      
      if (!userAddress) {
        throw new Error('No wallet connected')
      }
      
      // Use real Primus SDK for Twitter verification
      if (params.platform === 'twitter') {
        const result = await primusSDK.verifyTwitter(userAddress)
        
        if (result.success && result.attestation) {
          setVerificationResult(result)
          setAttestation(result.attestation)
          
          return {
            success: true,
            attestation: result.attestation
          }
        } else {
          throw new Error(result.error || 'Twitter verification failed')
        }
      } else if (params.platform === 'binance') {
        // Use real Primus SDK for Binance verification
        const result = await primusSDK.verifyBinance(userAddress)
        
        if (result.success && result.attestation) {
          setVerificationResult(result)
          setAttestation(result.attestation)
          
          return {
            success: true,
            attestation: result.attestation
          }
        } else {
          throw new Error(result.error || 'Binance verification failed')
        }
      } else {
        // For other platforms, return error for now
        throw new Error(`Platform ${params.platform} not supported yet`)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Verification failed'
      setError(message)
      console.error('zkTLS verification error:', err)
      return {
        success: false
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setAttestation(null)
    setVerificationResult(null)
  }, [])

  return {
    isLoading,
    error,
    attestation,
    verificationResult,
    verifyTwitter,
    startZKTLSVerification,
    reset
  }
}