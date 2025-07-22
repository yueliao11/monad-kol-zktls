import { ethers } from 'ethers'
import { PLATFORM_CONFIGS, type PlatformType } from './platform-config'

export interface CreatorProfile {
  wallet: string
  verifiedPlatforms: string[]
  credibilityScore: number
  creatorLevel: number
  personalToken: string
  canIssueTokens: boolean
  verifiedAt: number
}

export interface PlatformData {
  username: string
  followers: number
  contentCount: number
  engagement: number
  verifiedAt: number
}

export interface VerificationResult {
  success: boolean
  attestation?: any
  error?: string
  score?: number
}

export class CreatorPlatformSDK {
  private provider: ethers.JsonRpcProvider
  private signer: ethers.Signer | null = null
  private contractAddress: string
  private contract: ethers.Contract | null = null

  constructor(contractAddress: string, providerUrl: string) {
    this.contractAddress = contractAddress
    this.provider = new ethers.JsonRpcProvider(providerUrl)
  }

  async connect() {
    if (typeof window !== 'undefined' && window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await provider.getSigner()
      
      // Initialize contract
      const abi = [
        'function verifyPlatform(tuple(address recipient, string data, uint256 timestamp, bytes signature) attestation, uint8 platformType) external',
        'function getCreatorProfile(address creator) external view returns (address wallet, string[] verifiedPlatforms, uint256 credibilityScore, uint256 creatorLevel, address personalToken, bool canIssueTokens, uint256 verifiedAt)',
        'function getPlatformData(address creator, string platform) external view returns (string username, uint256 followers, uint256 contentCount, uint256 engagement, uint256 verifiedAt)',
        'function createCreatorToken(string name, string symbol) external returns (address)',
        'function createContent(string contentHash, string title, string platform) external returns (bytes32)',
        'function isVerifiedCreator(address creator) external view returns (bool)',
        'function canCreateToken(address creator) external view returns (bool)',
        'function getCreatorToken(address creator) external view returns (address)'
      ]
      
      this.contract = new ethers.Contract(this.contractAddress, abi, this.signer)
      return await this.signer.getAddress()
    }
    throw new Error('MetaMask not found')
  }

  async getCreatorProfile(address: string): Promise<CreatorProfile | null> {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      const result = await this.contract.getCreatorProfile(address)
      return {
        wallet: result[0],
        verifiedPlatforms: result[1],
        credibilityScore: Number(result[2]),
        creatorLevel: Number(result[3]),
        personalToken: result[4],
        canIssueTokens: result[5],
        verifiedAt: Number(result[6])
      }
    } catch (error) {
      console.error('Error getting creator profile:', error)
      return null
    }
  }

  async getPlatformData(address: string, platform: string): Promise<PlatformData | null> {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      const result = await this.contract.getPlatformData(address, platform.toLowerCase())
      return {
        username: result[0],
        followers: Number(result[1]),
        contentCount: Number(result[2]),
        engagement: Number(result[3]),
        verifiedAt: Number(result[4])
      }
    } catch (error) {
      console.error('Error getting platform data:', error)
      return null
    }
  }

  async verifyPlatform(platform: PlatformType, attestation: any): Promise<VerificationResult> {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      const platformIndex = Object.keys(PLATFORM_CONFIGS).indexOf(platform)
      const tx = await this.contract.verifyPlatform(attestation, platformIndex)
      await tx.wait()
      
      return { success: true, attestation }
    } catch (error) {
      console.error('Error verifying platform:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async createCreatorToken(name: string, symbol: string): Promise<string | null> {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      const tx = await this.contract.createCreatorToken(name, symbol)
      const receipt = await tx.wait()
      
      // Extract token address from events
      const event = receipt.logs.find((log: any) => log.topics[0] === ethers.id('TokenCreated(address,address,string,string)'))
      if (event) {
        return ethers.AbiCoder.defaultAbiCoder().decode(['address', 'address', 'string', 'string'], event.data)[1]
      }
      return null
    } catch (error) {
      console.error('Error creating token:', error)
      return null
    }
  }

  async createContent(contentHash: string, title: string, platform: string): Promise<string | null> {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      const tx = await this.contract.createContent(contentHash, title, platform)
      const receipt = await tx.wait()
      
      // Extract content ID from events
      const event = receipt.logs.find((log: any) => log.topics[0] === ethers.id('ContentCreated(bytes32,address,string,string)'))
      if (event) {
        return event.topics[1] // Content ID
      }
      return null
    } catch (error) {
      console.error('Error creating content:', error)
      return null
    }
  }

  async isVerifiedCreator(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      return await this.contract.isVerifiedCreator(address)
    } catch (error) {
      console.error('Error checking creator verification:', error)
      return false
    }
  }

  async canCreateToken(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      return await this.contract.canCreateToken(address)
    } catch (error) {
      console.error('Error checking token creation permission:', error)
      return false
    }
  }

  async getCreatorToken(address: string): Promise<string | null> {
    if (!this.contract) throw new Error('Contract not initialized')
    
    try {
      const tokenAddress = await this.contract.getCreatorToken(address)
      return tokenAddress === ethers.ZeroAddress ? null : tokenAddress
    } catch (error) {
      console.error('Error getting creator token:', error)
      return null
    }
  }
}