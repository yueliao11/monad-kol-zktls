import { KOLProfile } from '@/types/kol';

export const mockKOLData: KOLProfile[] = [
  {
    id: '1',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f8b3f1',
    username: 'CryptoWizard',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'DeFi expert with 5+ years experience. Specializing in yield farming and protocol analysis.',
    credibilityScore: {
      tradingSkill: 38,
      socialInfluence: 28,
      contentQuality: 18,
      transparency: 9,
      totalScore: 93
    },
    tradingData: {
      volume30d: 2500000,
      pnl30d: 18.5,
      winRate: 78,
      avgTradeSize: 8500,
      totalTrades: 294,
      verified: true
    },
    socialData: {
      twitter: {
        followers: 125000,
        verified: true,
        engagementRate: 4.2
      },
      tiktok: {
        followers: 45000,
        verified: true
      },
      bilibili: {
        followers: 12000,
        verified: true
      }
    },
    verificationStatus: 'verified',
    stakeAmount: 5000,
    kolTokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
    followersCount: 2847,
    isFollowing: false,
    joinedAt: new Date('2024-01-15'),
    lastUpdated: new Date('2024-07-20')
  },
  {
    id: '2',
    walletAddress: '0x8ba1f109551bD432803012645Hac136c82C3e8C9',
    username: 'DeFiQueen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b093?w=150&h=150&fit=crop&crop=face',
    bio: 'On-chain analyst focusing on L2 solutions and emerging protocols. Transparency first.',
    credibilityScore: {
      tradingSkill: 35,
      socialInfluence: 25,
      contentQuality: 19,
      transparency: 10,
      totalScore: 89
    },
    tradingData: {
      volume30d: 1800000,
      pnl30d: 22.3,
      winRate: 72,
      avgTradeSize: 6200,
      totalTrades: 290,
      verified: true
    },
    socialData: {
      twitter: {
        followers: 89000,
        verified: true,
        engagementRate: 5.1
      },
      medium: {
        followers: 15000,
        verified: true
      }
    },
    verificationStatus: 'verified',
    stakeAmount: 3000,
    kolTokenAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    followersCount: 1923,
    isFollowing: true,
    joinedAt: new Date('2024-02-20'),
    lastUpdated: new Date('2024-07-19')
  },
  {
    id: '3',
    walletAddress: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    username: 'NFTMaster',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'NFT market analyst and collector. Tracking blue chips and emerging collections.',
    credibilityScore: {
      tradingSkill: 32,
      socialInfluence: 22,
      contentQuality: 16,
      transparency: 7,
      totalScore: 77
    },
    tradingData: {
      volume30d: 1200000,
      pnl30d: 15.7,
      winRate: 68,
      avgTradeSize: 4100,
      totalTrades: 293,
      verified: true
    },
    socialData: {
      twitter: {
        followers: 67000,
        verified: false,
        engagementRate: 3.8
      }
    },
    verificationStatus: 'verified',
    stakeAmount: 2000,
    followersCount: 1234,
    isFollowing: false,
    joinedAt: new Date('2024-03-10'),
    lastUpdated: new Date('2024-07-18')
  },
  {
    id: '4',
    walletAddress: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
    username: 'AltcoinGuru',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    bio: 'Small cap gem hunter. Deep research on emerging altcoins and DeFi protocols.',
    credibilityScore: {
      tradingSkill: 28,
      socialInfluence: 18,
      contentQuality: 14,
      transparency: 6,
      totalScore: 66
    },
    tradingData: {
      volume30d: 800000,
      pnl30d: 12.4,
      winRate: 65,
      avgTradeSize: 2800,
      totalTrades: 286,
      verified: false
    },
    socialData: {
      twitter: {
        followers: 34000,
        verified: false,
        engagementRate: 2.9
      }
    },
    verificationStatus: 'pending',
    stakeAmount: 1000,
    followersCount: 567,
    isFollowing: false,
    joinedAt: new Date('2024-04-05'),
    lastUpdated: new Date('2024-07-17')
  },
  {
    id: '5',
    walletAddress: '0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db',
    username: 'MoonShotCaller',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face',
    bio: 'Technical analyst focusing on chart patterns and market sentiment. Daily alpha sharing.',
    credibilityScore: {
      tradingSkill: 30,
      socialInfluence: 20,
      contentQuality: 15,
      transparency: 8,
      totalScore: 73
    },
    tradingData: {
      volume30d: 950000,
      pnl30d: 19.2,
      winRate: 71,
      avgTradeSize: 3300,
      totalTrades: 288,
      verified: true
    },
    socialData: {
      twitter: {
        followers: 45000,
        verified: true,
        engagementRate: 4.7
      },
      zhihu: {
        followers: 8000,
        verified: true
      }
    },
    verificationStatus: 'verified',
    stakeAmount: 1500,
    followersCount: 892,
    isFollowing: true,
    joinedAt: new Date('2024-03-25'),
    lastUpdated: new Date('2024-07-20')
  }
];

export const credibilityTiers = {
  ELITE: { min: 90, max: 100, label: 'Elite', color: 'text-purple-600', bgColor: 'bg-purple-100' },
  EXPERT: { min: 80, max: 89, label: 'Expert', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  PROFESSIONAL: { min: 70, max: 79, label: 'Professional', color: 'text-green-600', bgColor: 'bg-green-100' },
  EXPERIENCED: { min: 60, max: 69, label: 'Experienced', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  BEGINNER: { min: 0, max: 59, label: 'Beginner', color: 'text-gray-600', bgColor: 'bg-gray-100' }
};

export const getCredibilityTier = (score: number) => {
  return Object.values(credibilityTiers).find(tier => score >= tier.min && score <= tier.max) || credibilityTiers.BEGINNER;
};