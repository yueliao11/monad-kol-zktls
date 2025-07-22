'use client'

import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Loader2, Wallet, User, Link, Copy, ExternalLink, Shield, Coins } from "lucide-react"
import { useCreatorPlatform } from "../hooks/useCreatorPlatform"

interface ERC6551AccountInfo {
  account: string
  nftTokenId: number
  isCreated: boolean
  balance: string
}

export function ERC6551Management() {
  const { profile, account, isLoading } = useCreatorPlatform()
  const [accountInfo, setAccountInfo] = useState<ERC6551AccountInfo | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isLoadingAccount, setIsLoadingAccount] = useState(false)

  useEffect(() => {
    if (account && profile) {
      loadAccountInfo()
    }
  }, [account, profile])

  const loadAccountInfo = async () => {
    if (!account) return
    
    setIsLoadingAccount(true)
    try {
      // This would call the ERC6551Integration contract
      // For now, we'll simulate the data
      const mockAccountInfo: ERC6551AccountInfo = {
        account: '0x1234567890123456789012345678901234567890',
        nftTokenId: 1,
        isCreated: (profile?.verifiedPlatforms?.length ?? 0) > 0,
        balance: '0.00'
      }
      setAccountInfo(mockAccountInfo)
    } catch (error) {
      console.error('Error loading account info:', error)
    } finally {
      setIsLoadingAccount(false)
    }
  }

  const createCreatorAccount = async () => {
    if (!account) return
    
    setIsCreating(true)
    try {
      // This would call the ERC6551Integration contract
      // For now, we'll simulate the creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newAccountInfo: ERC6551AccountInfo = {
        account: '0x' + Math.random().toString(16).substr(2, 40),
        nftTokenId: Math.floor(Math.random() * 1000),
        isCreated: true,
        balance: '0.00'
      }
      setAccountInfo(newAccountInfo)
    } catch (error) {
      console.error('Error creating account:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could show a toast notification here
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!account) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ERC-6551 链上钱包
          </CardTitle>
          <CardDescription>
            请先连接钱包以使用链上身份功能
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* ERC-6551 Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            ERC-6551 链上钱包
          </CardTitle>
          <CardDescription>
            为您的创作者身份创建专属的链上钱包账户，统一管理代币、NFT 和奖励
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">什么是 ERC-6551？</h3>
            <p className="text-sm text-blue-700">
              ERC-6551 是一个标准，允许每个 NFT 拥有自己的智能合约钱包。
              作为验证创作者，您将获得：
            </p>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• 专属的链上身份 NFT</li>
              <li>• 与 NFT 绑定的智能合约钱包</li>
              <li>• 统一的资产管理（代币、NFT、奖励）</li>
              <li>• 可编程的自动化功能</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Account Status */}
      <Card>
        <CardHeader>
          <CardTitle>账户状态</CardTitle>
          <CardDescription>
            您的 ERC-6551 账户信息和状态
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingAccount ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !accountInfo || !accountInfo.isCreated ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">您还没有创建 ERC-6551 账户</p>
              <p className="text-sm text-gray-500 mb-6">
                创建账户需要验证至少一个平台身份
              </p>
              <Button 
                onClick={createCreatorAccount}
                disabled={isCreating || !(profile?.verifiedPlatforms?.length ?? 0)}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Wallet className="mr-2 h-4 w-4" />
                    创建 ERC-6551 账户
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Account Address */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-700">链上钱包地址</div>
                  <div className="font-mono text-sm">{formatAddress(accountInfo.account)}</div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard(accountInfo.account)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`https://testnet.monadexplorer.com/address/${accountInfo.account}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* NFT Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-700">创作者身份 NFT</div>
                  <div className="text-sm">Token ID: #{accountInfo.nftTokenId}</div>
                </div>
                <Badge variant="default">已铸造</Badge>
              </div>

              {/* Balance */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-700">账户余额</div>
                  <div className="text-sm">{accountInfo.balance} MON</div>
                </div>
                <Button variant="outline" size="sm">
                  充值
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features */}
      {accountInfo?.isCreated && (
        <Card>
          <CardHeader>
            <CardTitle>账户功能</CardTitle>
            <CardDescription>
              使用您的 ERC-6551 账户执行各种操作
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                管理代币
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                管理 NFT
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                更新身份
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                安全设置
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>ERC-6551 优势</CardTitle>
          <CardDescription>
            了解 ERC-6551 账户为创作者带来的好处
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">统一资产管理</span>
              </div>
              <p className="text-sm text-gray-600 pl-4">
                所有与创作者身份相关的资产都存储在一个地址中
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">可编程功能</span>
              </div>
              <p className="text-sm text-gray-600 pl-4">
                支持自定义逻辑和自动化操作
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium">身份绑定</span>
              </div>
              <p className="text-sm text-gray-600 pl-4">
                NFT 身份与钱包功能完美结合
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm font-medium">可转移性</span>
              </div>
              <p className="text-sm text-gray-600 pl-4">
                整个创作者身份可以作为 NFT 进行转移
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}