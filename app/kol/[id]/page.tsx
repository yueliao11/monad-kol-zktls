'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { mockKOLData } from '@/lib/mock-data';
import { CredibilityScorer } from '@/lib/credibility-scorer';
import { useKOLFollow } from '@/hooks/useKOLFollow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  CheckCircle2, 
  TrendingUp, 
  Users, 
  Shield, 
  Activity,
  Calendar,
  Award,
  AlertTriangle,
  ExternalLink,
  Share2
} from 'lucide-react';
// import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function KOLDetailPage() {
  const params = useParams();
  const kolId = params.id as string;
  
  const [kol, setKol] = useState(() => 
    mockKOLData.find(k => k.id === kolId)
  );

  const { isFollowing, followerCount, isLoading, follow, unfollow } = useKOLFollow({
    kolAddress: kol?.walletAddress || ''
  });

  // Mock performance data for charts
  const performanceData = [
    { date: '07-01', pnl: 0, volume: 50000 },
    { date: '07-02', pnl: 2.3, volume: 75000 },
    { date: '07-03', pnl: 1.8, volume: 60000 },
    { date: '07-04', pnl: 4.2, volume: 90000 },
    { date: '07-05', pnl: 3.7, volume: 80000 },
    { date: '07-06', pnl: 5.1, volume: 110000 },
    { date: '07-07', pnl: 4.8, volume: 95000 },
    { date: '07-08', pnl: 6.2, volume: 120000 },
    { date: '07-09', pnl: 5.9, volume: 105000 },
    { date: '07-10', pnl: 7.3, volume: 135000 },
    { date: '07-11', pnl: 8.1, volume: 150000 },
    { date: '07-12', pnl: 7.8, volume: 140000 },
    { date: '07-13', pnl: 9.2, volume: 160000 },
    { date: '07-14', pnl: 8.7, volume: 155000 },
    { date: '07-15', pnl: 10.5, volume: 180000 },
    { date: '07-16', pnl: 12.1, volume: 200000 },
    { date: '07-17', pnl: 11.8, volume: 195000 },
    { date: '07-18', pnl: 13.2, volume: 220000 },
    { date: '07-19', pnl: 15.7, volume: 250000 },
    { date: '07-20', pnl: 18.5, volume: 280000 }
  ];

  if (!kol) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">KOL未找到</h2>
          <p className="text-gray-600 mb-4">该KOL不存在或已被移除</p>
          <Link href="/kol">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const tier = CredibilityScorer.getCredibilityTier(kol.credibilityScore.totalScore);
  const riskLevel = CredibilityScorer.calculateRiskLevel(kol.tradingData);
  const recommendation = CredibilityScorer.getFollowRecommendation(
    kol.credibilityScore.totalScore,
    riskLevel.level
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link href="/kol">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回列表
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{kol.username} 详情</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={kol.avatar} alt={kol.username} />
                    <AvatarFallback>{kol.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-bold mb-2">{kol.username}</h2>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    {kol.verificationStatus === 'verified' && (
                      <Badge className="bg-blue-100 text-blue-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        已验证
                      </Badge>
                    )}
                    <Badge className={`${tier.bgColor} ${tier.color}`}>{tier.tier}</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{kol.bio}</p>
                  
                  <div className="w-full space-y-2 mb-4">
                    <Button 
                      className="w-full"
                      onClick={isFollowing ? () => unfollow() : () => follow()}
                      disabled={isLoading}
                    >
                      {isLoading ? '处理中...' : isFollowing ? '取消跟随' : '跟随'}
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Share2 className="h-4 w-4 mr-2" />
                      分享
                    </Button>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>钱包: {kol.walletAddress.slice(0, 6)}...{kol.walletAddress.slice(-4)}</div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      加入时间: {kol.joinedAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">信誉评分分解</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: '交易技能', score: kol.credibilityScore.tradingSkill, max: 40, color: 'blue' },
                  { label: '社交影响力', score: kol.credibilityScore.socialInfluence, max: 30, color: 'purple' },
                  { label: '内容质量', score: kol.credibilityScore.contentQuality, max: 20, color: 'green' },
                  { label: '透明度', score: kol.credibilityScore.transparency, max: 10, color: 'yellow' }
                ].map(({ label, score, max, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{label}</span>
                      <span className="font-medium">{score}/{max}</span>
                    </div>
                    <Progress value={(score / max) * 100} className={`h-2 bg-${color}-100`} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">风险评估</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Shield className={`h-5 w-5 ${riskLevel.color}`} />
                  <span className={`font-medium ${riskLevel.color}`}>
                    {riskLevel.level} 风险
                  </span>
                </div>
                <p className="text-sm text-gray-600">{riskLevel.description}</p>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">投资建议</h4>
                  <div className={`text-sm font-medium mb-1 ${
                    recommendation.action === 'Strong Buy' ? 'text-green-600' :
                    recommendation.action === 'Buy' ? 'text-blue-600' :
                    recommendation.action === 'Hold' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {recommendation.action}
                  </div>
                  <p className="text-sm text-gray-600">{recommendation.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">+{kol.tradingData.pnl30d}%</div>
                  <div className="text-sm text-gray-600">30天收益</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{kol.tradingData.winRate}%</div>
                  <div className="text-sm text-gray-600">胜率</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{followerCount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">跟随者</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{kol.stakeAmount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">质押(VIBE)</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="performance" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="performance">表现分析</TabsTrigger>
                <TabsTrigger value="trades">交易记录</TabsTrigger>
                <TabsTrigger value="social">社交数据</TabsTrigger>
              </TabsList>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>30天收益曲线</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-[300px] bg-gradient-to-r from-green-50 to-blue-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700">性能图表</p>
                        <p className="text-sm text-gray-500">30天收益趋势分析</p>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-green-600">+15.7%</p>
                            <p className="text-xs text-gray-500">总收益</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-blue-600">68%</p>
                            <p className="text-xs text-gray-500">胜率</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-600">293</p>
                            <p className="text-xs text-gray-500">交易次数</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">交易统计</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">总交易量</span>
                        <span className="font-medium">${kol.tradingData.volume30d.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">平均交易规模</span>
                        <span className="font-medium">${kol.tradingData.avgTradeSize.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">交易次数</span>
                        <span className="font-medium">{kol.tradingData.totalTrades}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">收益统计</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">30天收益</span>
                        <span className="font-medium text-green-600">+{kol.tradingData.pnl30d}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">胜率</span>
                        <span className="font-medium">{kol.tradingData.winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">夏普比率</span>
                        <span className="font-medium">2.34</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="trades" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>最近交易记录</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      交易记录将通过zkTLS验证后展示
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>社交媒体数据</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {kol.socialData.twitter && (
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">T</span>
                          </div>
                          <div>
                            <div className="font-medium">Twitter</div>
                            <div className="text-sm text-gray-600">{kol.socialData.twitter.followers.toLocaleString()} 关注者
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {kol.socialData.twitter.verified && (
                            <Badge className="bg-blue-100 text-blue-700">
                              <CheckCircle2 className="h-3 w-3" />
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="text-center py-8 text-gray-500">
                      其他平台数据将通过zkTLS验证后展示
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}