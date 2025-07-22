'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Progress } from "./ui/progress"
import { User, Award, TrendingUp, Coins, Settings, BarChart3 } from "lucide-react"
import { CREATOR_LEVELS } from "../lib/platform-config"
import { useCreatorPlatform } from "../hooks/useCreatorPlatform"

export function CreatorDashboard() {
  const { profile, account } = useCreatorPlatform()
  
  if (!profile || !account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>创作者仪表板</CardTitle>
          <CardDescription>
            请先连接钱包并完成身份验证
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const currentLevel = profile.creatorLevel
  const nextLevel = Math.min(currentLevel + 1, 5)
  const currentLevelInfo = CREATOR_LEVELS[currentLevel as keyof typeof CREATOR_LEVELS]
  const nextLevelInfo = CREATOR_LEVELS[nextLevel as keyof typeof CREATOR_LEVELS]
  
  const progressToNext = nextLevel > currentLevel 
    ? Math.min((profile.credibilityScore - currentLevelInfo.minScore) / (nextLevelInfo.minScore - currentLevelInfo.minScore) * 100, 100)
    : 100

  return (
    <div className="space-y-6">
      {/* Profile Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">创作者档案</CardTitle>
                <CardDescription>
                  {account.slice(0, 6)}...{account.slice(-4)}
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              设置
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Creator Level */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline"
                  className="text-lg px-3 py-1"
                  style={{ borderColor: currentLevelInfo.color, color: currentLevelInfo.color }}
                >
                  {currentLevelInfo.name}
                </Badge>
                <div className="text-sm text-gray-600">
                  Level {currentLevel}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold" style={{ color: currentLevelInfo.color }}>
                  {profile.credibilityScore}
                </div>
                <div className="text-sm text-gray-600">信用分数</div>
              </div>
            </div>
            
            {nextLevel > currentLevel && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>距离下一级</span>
                  <span>{nextLevelInfo.minScore - profile.credibilityScore} 分</span>
                </div>
                <Progress value={progressToNext} className="h-2" />
              </div>
            )}
          </div>

          {/* Platform Verification Status */}
          <div className="space-y-2">
            <div className="text-sm font-medium">已验证平台</div>
            <div className="flex flex-wrap gap-2">
              {profile.verifiedPlatforms.length > 0 ? (
                profile.verifiedPlatforms.map((platform) => (
                  <Badge key={platform} variant="secondary">
                    {platform}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">暂无验证平台</span>
              )}
            </div>
          </div>

          {/* Token Status */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-gray-600" />
              <span className="text-sm">个人代币</span>
            </div>
            <div className="flex items-center gap-2">
              {profile.personalToken && profile.personalToken !== '0x0000000000000000000000000000000000000000' ? (
                <Badge variant="default">已创建</Badge>
              ) : profile.canIssueTokens ? (
                <Badge variant="outline">可创建</Badge>
              ) : (
                <Badge variant="secondary">暂无权限</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">影响力指数</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.credibilityScore}</div>
            <p className="text-xs text-muted-foreground">
              基于多平台综合评估
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">创作者等级</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {currentLevel}</div>
            <p className="text-xs text-muted-foreground">
              {currentLevelInfo.name}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">平台数量</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.verifiedPlatforms.length}</div>
            <p className="text-xs text-muted-foreground">
              已验证平台
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Level Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>等级权益</CardTitle>
          <CardDescription>
            不同等级的创作者享有不同的平台权益
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(CREATOR_LEVELS).map(([level, info]) => (
              <div
                key={level}
                className={`p-4 rounded-lg border ${
                  parseInt(level) === currentLevel
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={parseInt(level) === currentLevel ? "default" : "outline"}
                      style={{ 
                        backgroundColor: parseInt(level) === currentLevel ? info.color : 'transparent',
                        borderColor: info.color,
                        color: parseInt(level) === currentLevel ? 'white' : info.color
                      }}
                    >
                      {info.name}
                    </Badge>
                    <span className="text-sm text-gray-600">Level {level}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {info.minScore}+ 分
                  </div>
                </div>
                
                <div className="text-sm text-gray-700">
                  {getBenefitsByLevel(parseInt(level))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function getBenefitsByLevel(level: number): string {
  const benefits = {
    1: "基础创作者权益：内容发布、基础奖励",
    2: "进阶权益：提升奖励倍数、社区徽章",
    3: "专业权益：代币发行、高级分析、优先支持",
    4: "影响力权益：独家功能、合作机会、品牌推广",
    5: "顶级权益：所有功能、战略合作、平台治理参与"
  }
  return benefits[level as keyof typeof benefits] || "未知权益"
}