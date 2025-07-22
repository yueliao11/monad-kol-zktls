export interface KOLCredibilityScore {
  tradingSkill: number;
  socialInfluence: number;
  contentQuality: number;
  transparency: number;
  totalScore: number;
}

export interface KOLTradingData {
  volume30d: number;
  pnl30d: number;
  winRate: number;
  avgTradeSize: number;
  totalTrades: number;
  verified: boolean;
}

export interface KOLSocialData {
  twitter: {
    followers: number;
    verified: boolean;
    engagementRate: number;
  };
  tiktok?: {
    followers: number;
    verified: boolean;
  };
  bilibili?: {
    followers: number;
    verified: boolean;
  };
  medium?: {
    followers: number;
    verified: boolean;
  };
  zhihu?: {
    followers: number;
    verified: boolean;
  };
}

export interface KOLProfile {
  id: string;
  walletAddress: string;
  username: string;
  avatar: string;
  bio: string;
  credibilityScore: KOLCredibilityScore;
  tradingData: KOLTradingData;
  socialData: KOLSocialData;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  stakeAmount: number;
  kolTokenAddress?: string;
  followersCount: number;
  isFollowing: boolean;
  joinedAt: Date;
  lastUpdated: Date;
}

export interface KOLVerificationRequest {
  walletAddress: string;
  username: string;
  bio: string;
  exchangeVerifications: {
    binance?: boolean;
    okx?: boolean;
    bybit?: boolean;
    bitget?: boolean;
  };
  socialVerifications: {
    twitter?: string;
    tiktok?: string;
    bilibili?: string;
    medium?: string;
    zhihu?: string;
  };
  stakeAmount: number;
}