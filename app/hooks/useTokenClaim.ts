import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { VIBE_TOKEN_ABI } from '@/lib/contract-abi'

interface UseTokenClaimReturn {
  isLoading: boolean
  error: string | null
  txHash: string | null
  claimTokens: (contractAddress: string, attestation: any) => Promise<void>
  claimKOLReward: (contractAddress: string, attestation: any) => Promise<void>
  checkHasClaimed: (address: string, contractAddress: string) => Promise<boolean>
  checkHasJoinedKOL: (address: string, contractAddress: string) => Promise<boolean>
}

export function useTokenClaim(): UseTokenClaimReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)

  const claimTokens = useCallback(async (contractAddress: string, attestation: any) => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found')
      }

      if (!attestation) {
        throw new Error('Attestation is required')
      }

      // Connect to provider and get signer
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Create contract instance
      const contract = new ethers.Contract(contractAddress, VIBE_TOKEN_ABI, signer)
      
      // Call claimTokens with verified attestation
      const tx = await contract.claimTokens(attestation)
      setTxHash(tx.hash)
      
      // Wait for confirmation
      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)
      
    } catch (err: any) {
      console.error('Token claim error:', err)
      const message = err.reason || err.message || 'Unknown error occurred'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const claimKOLReward = useCallback(async (contractAddress: string, attestation: any) => {
    setIsLoading(true)
    setError(null)
    
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found')
      }

      if (!attestation) {
        throw new Error('Attestation is required')
      }

      // Connect to provider and get signer
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      
      // Create contract instance
      const contract = new ethers.Contract(contractAddress, VIBE_TOKEN_ABI, signer)
      
      // Call joinKOLList with verified attestation to get 300 VIBE reward
      const tx = await contract.joinKOLList(attestation)
      setTxHash(tx.hash)
      
      // Wait for confirmation
      const receipt = await tx.wait()
      console.log('KOL reward claimed:', receipt)
      
    } catch (err: any) {
      console.error('KOL reward claim error:', err)
      const message = err.reason || err.message || 'Unknown error occurred'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const checkHasClaimed = useCallback(async (address: string, contractAddress: string): Promise<boolean> => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, VIBE_TOKEN_ABI, provider)
      
      const hasClaimed = await contract.hasClaimed(address)
      return hasClaimed
    } catch (err) {
      console.error('Check claim error:', err)
      return false
    }
  }, [])

  const checkHasJoinedKOL = useCallback(async (address: string, contractAddress: string): Promise<boolean> => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found')
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, VIBE_TOKEN_ABI, provider)
      
      const hasJoined = await contract.hasJoinedKOL(address)
      return hasJoined
    } catch (err) {
      console.error('Check KOL joined error:', err)
      return false
    }
  }, [])

  return {
    isLoading,
    error,
    txHash,
    claimTokens,
    claimKOLReward,
    checkHasClaimed,
    checkHasJoinedKOL
  }
}