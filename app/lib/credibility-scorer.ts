import { KOLCredibilityScore, KOLTradingData, KOLSocialData } from '@/types/kol';

export interface CredibilityCalculationParams {
  tradingData: KOLTradingData;
  socialData: KOLSocialData;
  stakeAmount: number;
  verificationStatus: 'unverified' | 'pending' | 'verified';
  accountAge: number; // days
  contentMetrics?: {
    postsPerWeek: number;
    avgEngagementRate: number;
    consistencyScore: number; // 0-100
  };
}

export class CredibilityScorer {
  private static readonly WEIGHTS = {
    TRADING_SKILL: 0.4,
    SOCIAL_INFLUENCE: 0.3,
    CONTENT_QUALITY: 0.2,
    TRANSPARENCY: 0.1
  };

  private static readonly TIERS = {
    ELITE: 90,
    EXPERT: 80,
    PROFESSIONAL: 70,
    EXPERIENCED: 60,
    BEGINNER: 0
  };

  static calculateScore(params: CredibilityCalculationParams): KOLCredibilityScore {
    const tradingSkill = this.calculateTradingSkill(params.tradingData);
    const socialInfluence = this.calculateSocialInfluence(params.socialData);
    const contentQuality = this.calculateContentQuality(params.contentMetrics);
    const transparency = this.calculateTransparency(params);

    const totalScore = Math.round(
      tradingSkill * this.WEIGHTS.TRADING_SKILL +
      socialInfluence * this.WEIGHTS.SOCIAL_INFLUENCE +
      contentQuality * this.WEIGHTS.CONTENT_QUALITY +
      transparency * this.WEIGHTS.TRANSPARENCY
    );

    return {
      tradingSkill,
      socialInfluence,
      contentQuality,
      transparency,
      totalScore: Math.min(100, Math.max(0, totalScore))
    };
  }

  private static calculateTradingSkill(tradingData: KOLTradingData): number {
    let score = 0;

    // 交易量评分 (0-15分)
    const volumeScore = Math.min(15, Math.log10(tradingData.volume30d / 10000) * 3);
    score += Math.max(0, volumeScore);

    // 收益率评分 (0-15分)
    const pnlScore = Math.min(15, Math.max(0, tradingData.pnl30d * 0.5));
    score += Math.max(0, pnlScore);

    // 胜率评分 (0-10分)
    const winRateScore = (tradingData.winRate / 100) * 10;
    score += winRateScore;

    // 交易频率评分 (0-10分)
    const frequencyScore = Math.min(10, (tradingData.totalTrades / 30) * 2);
    score += Math.max(0, frequencyScore);

    return Math.round(score);
  }

  private static calculateSocialInfluence(socialData: KOLSocialData): number {
    let totalFollowers = 0;
    let verifiedAccounts = 0;
    let totalEngagement = 0;

    // Twitter影响力
    if (socialData.twitter) {
      totalFollowers += socialData.twitter.followers;
      if (socialData.twitter.verified) verifiedAccounts++;
      totalEngagement += socialData.twitter.engagementRate * 1000;
    }

    // 其他平台影响力
    const platforms = ['tiktok', 'bilibili', 'medium', 'zhihu'] as const;
    platforms.forEach(platform => {
      const data = socialData[platform];
      if (data) {
        totalFollowers += data.followers;
        if (data.verified) verifiedAccounts++;
      }
    });

    let score = 0;

    // 总关注者评分 (0-15分)
    const followersScore = Math.min(15, Math.log10(totalFollowers / 1000 + 1) * 5);
    score += followersScore;

    // 认证账户评分 (0-10分)
    const verifiedScore = verifiedAccounts * 2.5;
    score += Math.min(10, verifiedScore);

    // 互动率评分 (0-5分)
    const engagementScore = Math.min(5, totalEngagement / 10000);
    score += engagementScore;

    return Math.round(score);
  }

  private static calculateContentQuality(contentMetrics?: {
    postsPerWeek: number;
    avgEngagementRate: number;
    consistencyScore: number;
  }): number {
    if (!contentMetrics) {
      return Math.floor(Math.random() * 5) + 10; // 默认值 10-15
    }

    let score = 0;

    // 发布频率评分 (0-8分)
    const frequencyScore = Math.min(8, contentMetrics.postsPerWeek * 1.5);
    score += frequencyScore;

    // 互动质量评分 (0-7分)
    const engagementScore = Math.min(7, contentMetrics.avgEngagementRate * 0.7);
    score += engagementScore;

    // 一致性评分 (0-5分)
    const consistencyScore = (contentMetrics.consistencyScore / 100) * 5;
    score += consistencyScore;

    return Math.round(score);
  }

  private static calculateTransparency(params: CredibilityCalculationParams): number {
    let score = 0;

    // 验证状态评分 (0-4分)
    if (params.verificationStatus === 'verified') score += 4;
    else if (params.verificationStatus === 'pending') score += 2;

    // 质押金额评分 (0-6分)
    const stakeScore = Math.min(6, Math.log10(params.stakeAmount / 1000 + 1) * 2);
    score += stakeScore;

    return Math.round(score);
  }

  static getCredibilityTier(score: number): {
    tier: string;
    color: string;
    bgColor: string;
    description: string;
  } {
    if (score >= this.TIERS.ELITE) {
      return {
        tier: 'Elite',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        description: '顶级交易者，信誉卓越'
      };
    } else if (score >= this.TIERS.EXPERT) {
      return {
        tier: 'Expert',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        description: '专家级交易者，值得信赖'
      };
    } else if (score >= this.TIERS.PROFESSIONAL) {
      return {
        tier: 'Professional',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        description: '专业交易者，表现稳定'
      };
    } else if (score >= this.TIERS.EXPERIENCED) {
      return {
        tier: 'Experienced',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        description: '经验丰富，逐步提升'
      };
    } else {
      return {
        tier: 'Beginner',
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        description: '新手交易者，谨慎参考'
      };
    }
  }

  static calculateRiskLevel(tradingData: KOLTradingData): {
    level: 'Low' | 'Medium' | 'High' | 'Very High';
    color: string;
    description: string;
  } {
    const volatility = Math.abs(tradingData.pnl30d) / 10;
    const riskScore = (tradingData.winRate / 100) * 0.5 + (1 - volatility) * 0.5;

    if (riskScore >= 0.8) {
      return {
        level: 'Low',
        color: 'text-green-600',
        description: '低风险，稳健投资风格'
      };
    } else if (riskScore >= 0.6) {
      return {
        level: 'Medium',
        color: 'text-yellow-600',
        description: '中等风险，平衡收益与风险'
      };
    } else if (riskScore >= 0.4) {
      return {
        level: 'High',
        color: 'text-orange-600',
        description: '高风险，激进投资策略'
      };
    } else {
      return {
        level: 'Very High',
        color: 'text-red-600',
        description: '极高风险，谨慎跟随'
      };
    }
  }

  static getFollowRecommendation(score: number, riskLevel: string): {
    action: 'Strong Buy' | 'Buy' | 'Hold' | 'Avoid';
    reasoning: string;
  } {
    if (score >= 85 && riskLevel === 'Low') {
      return {
        action: 'Strong Buy',
        reasoning: '高信誉+低风险，强烈推荐跟随'
      };
    } else if (score >= 75 && riskLevel !== 'Very High') {
      return {
        action: 'Buy',
        reasoning: '信誉良好，风险可控，建议跟随'
      };
    } else if (score >= 60) {
      return {
        action: 'Hold',
        reasoning: '中等信誉，建议小仓位尝试'
      };
    } else {
      return {
        action: 'Avoid',
        reasoning: '信誉较低或风险过高，谨慎考虑'
      };
    }
  }
}