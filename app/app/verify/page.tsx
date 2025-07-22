'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Twitter, 
  Activity, 
  DollarSign,
  CheckCircle2, 
  XCircle, 
  Loader2,
  AlertCircle,
  ExternalLink,
  Key,
  Globe,
  TrendingUp,
  Users,
  Award,
  Clock
} from 'lucide-react';
import { useZKTLS } from '@/hooks/useZKTLS';
import { useTokenClaim } from '@/hooks/useTokenClaim';

interface VerificationHistory {
  id: string;
  platform: string;
  type: string;
  status: 'success' | 'failed' | 'pending';
  timestamp: Date;
  data?: any;
}

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistory[]>([
    {
      id: '1',
      platform: 'Twitter',
      type: 'social',
      status: 'success',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      data: { followers: 15234, username: '@crypto_trader' }
    },
    {
      id: '2',
      platform: 'Binance',
      type: 'exchange',
      status: 'success',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      data: { volume30d: 250000, trades: 142 }
    }
  ]);
  
  const { startZKTLSVerification } = useZKTLS();
  const { claimTokens } = useTokenClaim();

  const handleTwitterVerification = async () => {
    setIsLoading(true);
    try {
      const result = await startZKTLSVerification({
        type: 'social',
        platform: 'twitter',
        templateId: '2e3160ae-8b1e-45e3-8c59-426366278b9d'
      });
      
      if (result.success) {
        const newVerification: VerificationHistory = {
          id: String(Date.now()),
          platform: 'Twitter',
          type: 'social',
          status: 'success',
          timestamp: new Date(),
          data: result.attestation?.data ? JSON.parse(result.attestation.data) : null
        };
        
        setVerificationHistory(prev => [newVerification, ...prev]);
        alert('🎉 Twitter 验证成功！');
      } else {
        throw new Error('验证失败');
      }
    } catch (error) {
      const failedVerification: VerificationHistory = {
        id: String(Date.now()),
        platform: 'Twitter',
        type: 'social',
        status: 'failed',
        timestamp: new Date()
      };
      setVerificationHistory(prev => [failedVerification, ...prev]);
      alert(`❌ Twitter 验证失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBinanceVerification = async () => {
    setIsLoading(true);
    try {
      const result = await startZKTLSVerification({
        type: 'exchange',
        platform: 'binance',
        templateId: 'ad7d29c8-d820-495a-8bf1-02b8f236a1ae'
      });
      
      if (result.success) {
        const newVerification: VerificationHistory = {
          id: String(Date.now()),
          platform: 'Binance',
          type: 'exchange',
          status: 'success',
          timestamp: new Date(),
          data: result.attestation?.data ? JSON.parse(result.attestation.data) : null
        };
        
        setVerificationHistory(prev => [newVerification, ...prev]);
        alert('🎉 Binance 验证成功！');
      } else {
        throw new Error('验证失败');
      }
    } catch (error) {
      const failedVerification: VerificationHistory = {
        id: String(Date.now()),
        platform: 'Binance',
        type: 'exchange',
        status: 'failed',
        timestamp: new Date()
      };
      setVerificationHistory(prev => [failedVerification, ...prev]);
      alert(`❌ Binance 验证失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimTokens = async () => {
    try {
      const contractAddress = process.env.NEXT_PUBLIC_VIBE_TOKEN_ADDRESS || '0x91a44beCCBd69f04414202e7E538d845C4F85b7a';
      const twitterVerification = verificationHistory.find(v => v.platform === 'Twitter' && v.status === 'success');
      
      if (!twitterVerification) {
        alert('请先完成 Twitter 验证');
        return;
      }

      await claimTokens(contractAddress, twitterVerification.data);
      alert('🎉 成功领取 100 VIBE 代币！');
    } catch (error) {
      alert(`代币领取失败：${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const successfulVerifications = verificationHistory.filter(v => v.status === 'success');
  const hasTwitterVerification = successfulVerifications.some(v => v.platform === 'Twitter');
  const hasBinanceVerification = successfulVerifications.some(v => v.platform === 'Binance');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-blue-600" />
            zkTLS 验证中心
          </h1>
          <p className="text-gray-600">
            使用零知识传输层安全协议验证您的身份和数据，保护隐私的同时证明真实性
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{successfulVerifications.length}</div>
              <div className="text-sm text-gray-600">成功验证</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {hasTwitterVerification && hasBinanceVerification ? '100' : '0'}
              </div>
              <div className="text-sm text-gray-600">可领取 VIBE</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-gray-600">支持平台</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-gray-600">隐私保护</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="verify" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verify">开始验证</TabsTrigger>
            <TabsTrigger value="history">验证历史</TabsTrigger>
            <TabsTrigger value="rewards">奖励中心</TabsTrigger>
          </TabsList>

          <TabsContent value="verify" className="space-y-6">
            {/* zkTLS Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  什么是 zkTLS？
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  zkTLS (零知识传输层安全) 是一种创新的隐私保护验证技术，允许您在不泄露敏感信息的前提下证明数据的真实性。
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h4 className="font-medium mb-2">隐私保护</h4>
                    <p className="text-sm text-gray-600">只证明必要信息，敏感数据保持私密</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h4 className="font-medium mb-2">真实可信</h4>
                    <p className="text-sm text-gray-600">密码学保证数据未被篡改</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h4 className="font-medium mb-2">通用兼容</h4>
                    <p className="text-sm text-gray-600">支持多种 Web2 平台和服务</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Verification Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Twitter Verification */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Twitter className="h-6 w-6 mr-2 text-blue-500" />
                      <div>
                        <CardTitle className="text-lg">Twitter 身份验证</CardTitle>
                        <CardDescription>验证您的 Twitter 账户所有权</CardDescription>
                      </div>
                    </div>
                    {hasTwitterVerification && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">验证内容</span>
                      <span>用户名、关注者数量</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">奖励</span>
                      <span className="text-green-600">+50 VIBE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">验证时间</span>
                      <span>~30 秒</span>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      请确保您已登录 Twitter 账户，验证过程需要访问您的个人资料信息
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleTwitterVerification}
                    disabled={isLoading || hasTwitterVerification}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        验证中...
                      </>
                    ) : hasTwitterVerification ? (
                      '✅ 已验证'
                    ) : (
                      '开始 Twitter 验证'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Binance Verification */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Activity className="h-6 w-6 mr-2 text-orange-500" />
                      <div>
                        <CardTitle className="text-lg">Binance 交易验证</CardTitle>
                        <CardDescription>验证您的交易量和活跃度</CardDescription>
                      </div>
                    </div>
                    {hasBinanceVerification && <CheckCircle2 className="h-6 w-6 text-green-500" />}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">验证内容</span>
                      <span>30天交易量、交易次数</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">奖励</span>
                      <span className="text-green-600">+50 VIBE</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">验证时间</span>
                      <span>~45 秒</span>
                    </div>
                  </div>
                  
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      请确保您已登录 Binance 账户，验证过程需要访问您的交易数据
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleBinanceVerification}
                    disabled={isLoading || hasBinanceVerification}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        验证中...
                      </>
                    ) : hasBinanceVerification ? (
                      '✅ 已验证'
                    ) : (
                      '开始 Binance 验证'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Coming Soon */}
            <Card>
              <CardHeader>
                <CardTitle>更多平台即将支持</CardTitle>
                <CardDescription>我们正在添加更多平台的 zkTLS 验证支持</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'OKX', icon: Activity, status: '开发中' },
                    { name: 'Coinbase', icon: DollarSign, status: '计划中' },
                    { name: 'Medium', icon: Users, status: '计划中' },
                    { name: 'Quora', icon: Globe, status: '计划中' }
                  ].map(platform => (
                    <div key={platform.name} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                      <div className="flex items-center">
                        <platform.icon className="h-5 w-5 mr-2 text-gray-500" />
                        <span className="font-medium text-gray-700">{platform.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {platform.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>验证历史记录</CardTitle>
                <CardDescription>您所有的 zkTLS 验证记录</CardDescription>
              </CardHeader>
              <CardContent>
                {verificationHistory.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>暂无验证记录</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {verificationHistory.map(verification => (
                      <div key={verification.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${
                            verification.status === 'success' ? 'bg-green-100' :
                            verification.status === 'failed' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}>
                            {verification.status === 'success' ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : verification.status === 'failed' ? (
                              <XCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{verification.platform}</div>
                            <div className="text-sm text-gray-600">
                              {verification.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={verification.status === 'success' ? 'default' : 'destructive'}
                            className="mb-1"
                          >
                            {verification.status === 'success' ? '成功' : 
                             verification.status === 'failed' ? '失败' : '进行中'}
                          </Badge>
                          {verification.data && (
                            <div className="text-xs text-gray-500">
                              {verification.platform === 'Twitter' && `${verification.data.followers} 关注者`}
                              {verification.platform === 'Binance' && `$${verification.data.volume30d?.toLocaleString()} 交易量`}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rewards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  奖励中心
                </CardTitle>
                <CardDescription>完成验证获得 VIBE 代币奖励</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">50 VIBE</div>
                    <div className="text-sm text-gray-600 mb-2">Twitter 验证奖励</div>
                    <Badge variant={hasTwitterVerification ? 'default' : 'outline'}>
                      {hasTwitterVerification ? '已获得' : '未完成'}
                    </Badge>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 mb-2">50 VIBE</div>
                    <div className="text-sm text-gray-600 mb-2">Binance 验证奖励</div>
                    <Badge variant={hasBinanceVerification ? 'default' : 'outline'}>
                      {hasBinanceVerification ? '已获得' : '未完成'}
                    </Badge>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">100 VIBE</div>
                    <div className="text-sm text-gray-600 mb-2">全部验证奖励</div>
                    <Badge variant={hasTwitterVerification && hasBinanceVerification ? 'default' : 'outline'}>
                      {hasTwitterVerification && hasBinanceVerification ? '可领取' : '未完成'}
                    </Badge>
                  </div>
                </div>
                
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    完成 Twitter 和 Binance 验证后，您可以一次性领取 100 VIBE 代币奖励
                  </AlertDescription>
                </Alert>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleClaimTokens}
                  disabled={!hasTwitterVerification || !hasBinanceVerification}
                >
                  {hasTwitterVerification && hasBinanceVerification ? (
                    '领取 100 VIBE 奖励'
                  ) : (
                    `还需完成 ${2 - successfulVerifications.length} 个验证`
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Future Rewards */}
            <Card>
              <CardHeader>
                <CardTitle>即将推出的奖励</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { platform: 'OKX 交易验证', reward: '75 VIBE', status: '开发中' },
                    { platform: 'Medium 创作验证', reward: '60 VIBE', status: '计划中' },
                    { platform: '多平台完整验证', reward: '300 VIBE', status: '计划中' }
                  ].map(reward => (
                    <div key={reward.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{reward.platform}</div>
                        <div className="text-sm text-gray-600">奖励：{reward.reward}</div>
                      </div>
                      <Badge variant="outline">{reward.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}