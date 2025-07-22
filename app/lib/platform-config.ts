// Platform verification configuration  
export const PLATFORM_CONFIGS = {
  TWITTER: {
    name: 'X (Twitter)',
    icon: 'twitter',
    color: '#000000',
    templateId: '2e3160ae-8b1e-45e3-8c59-426366278b9d', // Updated for X Web3 KOL app
    dataPath: 'screen_name',
    description: '验证 X (Twitter) 账号所有权和影响力',
    requiredFields: ['followers', 'posts', 'likes']
  },
  QUORA: {
    name: 'Quora',
    icon: 'message-circle',
    color: '#B92B27',
    templateId: 'YOUR_QUORA_TEMPLATE_ID', // To be configured in Primus Hub
    dataPath: 'username',
    description: '验证 Quora 账号所有权和专业度',
    requiredFields: ['followers', 'answers', 'upvotes']
  },
  MEDIUM: {
    name: 'Medium',
    icon: 'edit',
    color: '#00AB6C',
    templateId: 'YOUR_MEDIUM_TEMPLATE_ID', // To be configured in Primus Hub
    dataPath: 'username',
    description: '验证 Medium 账号所有权和创作能力',
    requiredFields: ['followers', 'posts', 'claps']
  },
  BINANCE: {
    name: 'Binance',
    icon: 'coins',
    color: '#F3BA2F',
    templateId: 'YOUR_BINANCE_TEMPLATE_ID', // To be configured in Primus Hub
    dataPath: 'accountId',
    description: '验证 Binance 账号所有权和交易资质',
    requiredFields: ['vip_level', 'balance']
  },
  OKX: {
    name: 'OKX',
    icon: 'trending-up',
    color: '#0052FF',
    templateId: 'YOUR_OKX_TEMPLATE_ID', // To be configured in Primus Hub
    dataPath: 'uid',
    description: '验证 OKX 账号所有权和交易能力',
    requiredFields: ['level', 'holdings']
  }
} as const

export type PlatformType = keyof typeof PLATFORM_CONFIGS

export const CONTENT_PLATFORMS: PlatformType[] = ['TWITTER', 'QUORA', 'MEDIUM']
export const EXCHANGE_PLATFORMS: PlatformType[] = ['BINANCE', 'OKX']

// Creator level thresholds
export const CREATOR_LEVELS = {
  1: { name: '新手创作者', minScore: 0, color: '#94A3B8' },
  2: { name: '活跃创作者', minScore: 250, color: '#3B82F6' },
  3: { name: '专业创作者', minScore: 500, color: '#10B981' },
  4: { name: '影响力创作者', minScore: 750, color: '#F59E0B' },
  5: { name: '顶级创作者', minScore: 1000, color: '#EF4444' }
} as const

// Platform scoring weights
export const SCORING_WEIGHTS = {
  TWITTER: { followers: 0.1, posts: 1, likes: 0.02 },
  QUORA: { followers: 0.2, answers: 2, upvotes: 0.1 },
  MEDIUM: { followers: 0.2, posts: 2, claps: 0.05 },
  BINANCE: { base: 500 },
  OKX: { base: 500 }
} as const