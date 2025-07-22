'use client'

import { useState } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Loader2, Coins, CheckCircle, AlertCircle } from "lucide-react"
import { useCreatorPlatform } from "../hooks/useCreatorPlatform"
import { CREATOR_LEVELS } from "../lib/platform-config"

interface TokenCreationProps {
  onTokenCreated?: (tokenAddress: string) => void
}

export function TokenCreation({ onTokenCreated }: TokenCreationProps) {
  const { profile, createCreatorToken, isLoading, account } = useCreatorPlatform()
  const [tokenName, setTokenName] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [tokenDescription, setTokenDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createdToken, setCreatedToken] = useState<string | null>(null)

  const canCreateToken = profile?.canIssueTokens && !profile?.personalToken
  const hasExistingToken = profile?.personalToken && profile.personalToken !== '0x0000000000000000000000000000000000000000'
  const creatorLevel = profile?.creatorLevel || 1
  const levelInfo = CREATOR_LEVELS[creatorLevel as keyof typeof CREATOR_LEVELS]

  const handleCreateToken = async () => {
    if (!tokenName || !tokenSymbol || !account) return
    
    setIsCreating(true)
    try {
      const tokenAddress = await createCreatorToken(tokenName, tokenSymbol)
      if (tokenAddress) {
        setCreatedToken(tokenAddress)
        onTokenCreated?.(tokenAddress)
      }
    } catch (error) {
      console.error('Token creation failed:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const generateTokenSymbol = (name: string) => {
    return name.toUpperCase().replace(/\s+/g, '').slice(0, 6)
  }

  const handleNameChange = (name: string) => {
    setTokenName(name)
    if (name && !tokenSymbol) {
      setTokenSymbol(generateTokenSymbol(name))
    }
  }

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            个性化代币发行
          </CardTitle>
          <CardDescription>
            请先连接钱包以使用代币发行功能
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            个性化代币发行
          </CardTitle>
          <CardDescription>
            正在加载创作者资料...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            个性化代币发行
          </CardTitle>
          <CardDescription>
            为您的创作者身份发行专属代币，建立个人品牌经济
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Creator Level Display */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="space-y-1">
              <div className="text-sm font-medium">当前创作者等级</div>
              <Badge 
                variant="outline" 
                className="text-lg px-3 py-1"
                style={{ borderColor: levelInfo.color, color: levelInfo.color }}
              >
                {levelInfo.name}
              </Badge>
            </div>
            <div className="text-right space-y-1">
              <div className="text-sm text-gray-600">信用分数</div>
              <div className="text-2xl font-bold" style={{ color: levelInfo.color }}>
                {profile.credibilityScore}
              </div>
            </div>
          </div>

          {/* Token Creation Status */}
          {hasExistingToken ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium text-green-800">代币已创建</div>
                <div className="text-sm text-green-600">
                  合约地址: {profile.personalToken}
                </div>
              </div>
            </div>
          ) : !canCreateToken ? (
            <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="font-medium text-yellow-800">暂无代币发行权限</div>
                <div className="text-sm text-yellow-600">
                  请完成更多平台验证以提升至3级或以上创作者
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-800">具备代币发行权限</div>
                <div className="text-sm text-blue-600">
                  您可以创建个性化代币并开启创作者经济
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Token Creation Form */}
      {canCreateToken && !hasExistingToken && (
        <Card>
          <CardHeader>
            <CardTitle>创建您的代币</CardTitle>
            <CardDescription>
              设计专属于您的创作者代币，初始供应量为 1,000,000 枚
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tokenName">代币名称</Label>
              <Input
                id="tokenName"
                placeholder="例如：张三创作者币"
                value={tokenName}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tokenSymbol">代币符号</Label>
              <Input
                id="tokenSymbol"
                placeholder="例如：ZHANGSAN"
                value={tokenSymbol}
                onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                maxLength={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tokenDescription">代币描述（可选）</Label>
              <Textarea
                id="tokenDescription"
                placeholder="描述您的代币用途和价值..."
                value={tokenDescription}
                onChange={(e) => setTokenDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="font-medium">代币参数</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">标准: </span>
                  <span>ERC-20</span>
                </div>
                <div>
                  <span className="text-gray-600">初始供应: </span>
                  <span>1,000,000</span>
                </div>
                <div>
                  <span className="text-gray-600">小数位数: </span>
                  <span>18</span>
                </div>
                <div>
                  <span className="text-gray-600">所有者: </span>
                  <span>您</span>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleCreateToken}
              disabled={!tokenName || !tokenSymbol || isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  创建中...
                </>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  创建代币
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Token Management */}
      {hasExistingToken && (
        <Card>
          <CardHeader>
            <CardTitle>代币管理</CardTitle>
            <CardDescription>
              管理您的创作者代币和奖励池
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>代币合约地址</Label>
                <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                  {profile.personalToken}
                </div>
              </div>
              <div className="space-y-2">
                <Label>当前余额</Label>
                <div className="p-3 bg-gray-50 rounded-md text-sm">
                  加载中...
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                查看代币详情
              </Button>
              <Button variant="outline" className="flex-1">
                配置奖励池
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}