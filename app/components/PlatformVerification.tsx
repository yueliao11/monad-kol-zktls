'use client'

import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Progress } from "./ui/progress"
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { PLATFORM_CONFIGS, CONTENT_PLATFORMS, EXCHANGE_PLATFORMS, type PlatformType } from "../lib/platform-config"
import { useMultiPlatformZKTLS } from "../hooks/useMultiPlatformZKTLS"
import { useCreatorPlatform } from "../hooks/useCreatorPlatform"

interface PlatformVerificationProps {
  userAddress: string
  onVerificationComplete?: (platform: PlatformType, result: any) => void
}

export function PlatformVerification({ userAddress, onVerificationComplete }: PlatformVerificationProps) {
  const { verifyPlatform, verificationStates, getOverallProgress } = useMultiPlatformZKTLS()
  const { verifyPlatform: submitVerification, profile } = useCreatorPlatform()
  
  const progress = getOverallProgress()

  const handleVerify = async (platform: PlatformType) => {
    try {
      // Step 1: Get zkTLS attestation
      const zkResult = await verifyPlatform(platform, userAddress)
      
      if (zkResult.success && zkResult.attestation) {
        // Step 2: Submit to smart contract
        const contractResult = await submitVerification(platform, zkResult.attestation)
        
        if (contractResult.success) {
          onVerificationComplete?.(platform, {
            zkResult,
            contractResult
          })
        }
      }
    } catch (error) {
      console.error('Verification failed:', error)
    }
  }

  const getPlatformIcon = (platform: PlatformType) => {
    const config = PLATFORM_CONFIGS[platform]
    // Return appropriate icon based on platform
    switch (config.icon) {
      case 'twitter': return '𝕏' // Updated for X branding
      case 'message-circle': return '🗨️'
      case 'edit': return '✏️'
      case 'coins': return '💰'
      case 'trending-up': return '📈'
      default: return '🔗'
    }
  }

  const getVerificationStatus = (platform: PlatformType) => {
    const state = verificationStates[platform]
    const isVerified = profile?.verifiedPlatforms.includes(platform.toLowerCase())
    
    if (isVerified) {
      return { status: 'verified', icon: CheckCircle, color: 'text-green-600' }
    } else if (state.isLoading) {
      return { status: 'loading', icon: Loader2, color: 'text-blue-600' }
    } else if (state.error) {
      return { status: 'error', icon: XCircle, color: 'text-red-600' }
    } else {
      return { status: 'pending', icon: AlertCircle, color: 'text-yellow-600' }
    }
  }

  const renderPlatformCard = (platform: PlatformType) => {
    const config = PLATFORM_CONFIGS[platform]
    const state = verificationStates[platform]
    const status = getVerificationStatus(platform)
    const StatusIcon = status.icon
    const isVerified = profile?.verifiedPlatforms.includes(platform.toLowerCase())
    
    return (
      <Card key={platform} className="relative">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getPlatformIcon(platform)}</div>
              <div>
                <CardTitle className="text-lg">{config.name}</CardTitle>
                <CardDescription className="text-sm">
                  {config.description}
                </CardDescription>
              </div>
            </div>
            <StatusIcon className={`h-5 w-5 ${status.color}`} />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {state.error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {state.error}
            </div>
          )}
          
          {state.result?.score && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>影响力得分</span>
                <span className="font-medium">{state.result.score}</span>
              </div>
              <Progress value={Math.min(state.result.score / 10, 100)} className="h-2" />
            </div>
          )}
          
          <Button 
            onClick={() => handleVerify(platform)}
            disabled={state.isLoading || isVerified}
            className="w-full"
            variant={isVerified ? "outline" : "default"}
          >
            {state.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                验证中...
              </>
            ) : isVerified ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                已验证
              </>
            ) : (
              `验证 ${config.name}`
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>验证进度</CardTitle>
          <CardDescription>
            完成多平台验证以提升创作者等级和解锁更多功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              已完成 {progress.completed} / {progress.total} 个平台
            </span>
            <Badge variant={progress.percentage === 100 ? "default" : "secondary"}>
              {progress.percentage.toFixed(0)}%
            </Badge>
          </div>
          <Progress value={progress.percentage} className="h-2" />
          
          {profile && (
            <div className="flex items-center gap-4 pt-2">
              <div className="text-sm">
                <span className="text-gray-600">信用分数: </span>
                <span className="font-medium">{profile.credibilityScore}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">创作者等级: </span>
                <Badge variant="outline">Level {profile.creatorLevel}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Platforms */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">内容创作平台</h3>
          <Badge variant="outline">必需至少1个</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTENT_PLATFORMS.map(renderPlatformCard)}
        </div>
      </div>

      {/* Exchange Platforms */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">交易所平台</h3>
          <Badge variant="outline">可选，提升信用分</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EXCHANGE_PLATFORMS.map(renderPlatformCard)}
        </div>
      </div>
    </div>
  )
}