'use client'

import { useState, useEffect } from 'react'
import { CreatorPlatformSDK, type CreatorProfile, type PlatformData, type VerificationResult } from '../lib/creator-platform-sdk'
import { type PlatformType } from '../lib/platform-config'

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CREATOR_PLATFORM_ADDRESS || ''
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'https://testnet-rpc.monad.xyz'

export function useCreatorPlatform() {
  const [sdk, setSdk] = useState<CreatorPlatformSDK | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<CreatorProfile | null>(null)

  useEffect(() => {
    const initSdk = new CreatorPlatformSDK(CONTRACT_ADDRESS, RPC_URL)
    setSdk(initSdk)
  }, [])

  const connect = async () => {
    if (!sdk) return
    
    setIsLoading(true)
    try {
      const address = await sdk.connect()
      setAccount(address)
      setIsConnected(true)
      
      // Load creator profile
      const creatorProfile = await sdk.getCreatorProfile(address)
      setProfile(creatorProfile)
    } catch (error) {
      console.error('Failed to connect:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const verifyPlatform = async (platform: PlatformType, attestation: any): Promise<VerificationResult> => {
    if (!sdk || !account) {
      return { success: false, error: 'SDK not initialized or not connected' }
    }

    setIsLoading(true)
    try {
      const result = await sdk.verifyPlatform(platform, attestation)
      
      if (result.success) {
        // Refresh profile after successful verification
        const updatedProfile = await sdk.getCreatorProfile(account)
        setProfile(updatedProfile)
      }
      
      return result
    } catch (error) {
      console.error('Platform verification failed:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    } finally {
      setIsLoading(false)
    }
  }

  const getPlatformData = async (platform: string): Promise<PlatformData | null> => {
    if (!sdk || !account) return null
    
    return await sdk.getPlatformData(account, platform)
  }

  const createCreatorToken = async (name: string, symbol: string): Promise<string | null> => {
    if (!sdk || !account) return null
    
    setIsLoading(true)
    try {
      const tokenAddress = await sdk.createCreatorToken(name, symbol)
      
      if (tokenAddress) {
        // Refresh profile after token creation
        const updatedProfile = await sdk.getCreatorProfile(account)
        setProfile(updatedProfile)
      }
      
      return tokenAddress
    } catch (error) {
      console.error('Token creation failed:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const createContent = async (contentHash: string, title: string, platform: string): Promise<string | null> => {
    if (!sdk) return null
    
    setIsLoading(true)
    try {
      return await sdk.createContent(contentHash, title, platform)
    } catch (error) {
      console.error('Content creation failed:', error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (!sdk || !account) return
    
    const updatedProfile = await sdk.getCreatorProfile(account)
    setProfile(updatedProfile)
  }

  return {
    account,
    isConnected,
    isLoading,
    profile,
    connect,
    verifyPlatform,
    getPlatformData,
    createCreatorToken,
    createContent,
    refreshProfile
  }
}