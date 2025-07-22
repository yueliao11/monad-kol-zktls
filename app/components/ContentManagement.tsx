'use client'

import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Loader2, FileText, TrendingUp, Award, Plus, Eye, Heart, Share2 } from "lucide-react"
import { useCreatorPlatform } from "../hooks/useCreatorPlatform"
import { PLATFORM_CONFIGS } from "../lib/platform-config"

interface ContentItem {
  id: string
  title: string
  platform: string
  contentHash: string
  createdAt: number
  views: number
  likes: number
  shares: number
  rewardAmount: number
  isRewarded: boolean
}

export function ContentManagement() {
  const { createContent, profile, account, isLoading } = useCreatorPlatform()
  const [contents, setContents] = useState<ContentItem[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  
  // Form state
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState('')
  const [contentHash, setContentHash] = useState('')
  const [description, setDescription] = useState('')

  const handleCreateContent = async () => {
    if (!title || !platform || !contentHash) return
    
    setIsCreating(true)
    try {
      const contentId = await createContent(contentHash, title, platform)
      if (contentId) {
        // Add to local state for demo
        const newContent: ContentItem = {
          id: contentId,
          title,
          platform,
          contentHash,
          createdAt: Date.now(),
          views: 0,
          likes: 0,
          shares: 0,
          rewardAmount: 0,
          isRewarded: false
        }
        setContents(prev => [newContent, ...prev])
        
        // Reset form
        setTitle('')
        setPlatform('')
        setContentHash('')
        setDescription('')
        setShowCreateForm(false)
      }
    } catch (error) {
      console.error('Content creation failed:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('zh-CN')
  }

  const getEngagementScore = (content: ContentItem) => {
    return content.views + (content.likes * 10) + (content.shares * 50)
  }

  const getPlatformColor = (platform: string) => {
    const config = Object.values(PLATFORM_CONFIGS).find(
      p => p.name.toLowerCase() === platform.toLowerCase()
    )
    return config?.color || '#6B7280'
  }

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            内容管理
          </CardTitle>
          <CardDescription>
            请先连接钱包以管理您的内容
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总内容数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contents.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总奖励</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contents.reduce((sum, content) => sum + content.rewardAmount, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">代币奖励</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总互动</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contents.reduce((sum, content) => sum + getEngagementScore(content), 0)}
            </div>
            <p className="text-xs text-muted-foreground">互动分数</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Creation */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                内容创建
              </CardTitle>
              <CardDescription>
                创建新内容并自动参与激励分发
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              variant={showCreateForm ? "outline" : "default"}
            >
              <Plus className="h-4 w-4 mr-2" />
              {showCreateForm ? '取消' : '创建内容'}
            </Button>
          </div>
        </CardHeader>
        
        {showCreateForm && (
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">内容标题</Label>
                <Input
                  id="title"
                  placeholder="输入内容标题"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform">发布平台</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择发布平台" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="quora">Quora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contentHash">内容哈希 (IPFS)</Label>
              <Input
                id="contentHash"
                placeholder="Qm... (IPFS 哈希)"
                value={contentHash}
                onChange={(e) => setContentHash(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">内容描述</Label>
              <Textarea
                id="description"
                placeholder="描述您的内容..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <Button 
              onClick={handleCreateContent}
              disabled={!title || !platform || !contentHash || isCreating}
              className="w-full"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  创建中...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  创建内容
                </>
              )}
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Content List */}
      <Card>
        <CardHeader>
          <CardTitle>我的内容</CardTitle>
          <CardDescription>
            管理您的内容并查看奖励状态
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contents.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">还没有内容</p>
              <p className="text-sm text-gray-400 mt-1">创建您的第一个内容开始赚取奖励</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contents.map((content) => (
                <div
                  key={content.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-medium">{content.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline"
                          style={{ 
                            borderColor: getPlatformColor(content.platform),
                            color: getPlatformColor(content.platform)
                          }}
                        >
                          {content.platform}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(content.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {content.isRewarded ? (
                        <Badge variant="default">
                          <Award className="h-3 w-3 mr-1" />
                          已奖励
                        </Badge>
                      ) : (
                        <Badge variant="secondary">待奖励</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4 text-gray-400" />
                      <span>{content.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4 text-gray-400" />
                      <span>{content.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-4 w-4 text-gray-400" />
                      <span>{content.shares}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <div className="text-sm">
                      <span className="text-gray-600">互动分数: </span>
                      <span className="font-medium">{getEngagementScore(content)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">奖励: </span>
                      <span className="font-medium">{content.rewardAmount.toFixed(2)} 代币</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}