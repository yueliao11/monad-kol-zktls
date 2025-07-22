'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Shield, 
  Users, 
  TrendingUp, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Globe,
  Award
} from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [stats, setStats] = useState({
    totalKOLs: 0,
    verifiedKOLs: 0,
    totalVolume: 0,
    platformsSupported: 2
  });

  useEffect(() => {
    // Simulate loading stats
    setTimeout(() => {
      setStats({
        totalKOLs: 127,
        verifiedKOLs: 89,
        totalVolume: 2850000,
        platformsSupported: 2
      });
    }, 500);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Crown className="h-16 w-16 text-purple-600 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900">
              X Web3 KOL Platform
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            基于 zkTLS 的去中心化 KOL 影响力验证平台<br/>
            通过零知识证明技术，实现多平台身份验证和可信的粉丝经济生态
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/verify">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Shield className="h-5 w-5 mr-2" />
                开始验证
              </Button>
            </Link>
            <Link href="/kol">
              <Button size="lg" variant="outline">
                <Users className="h-5 w-5 mr-2" />
                浏览 KOL
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalKOLs}</div>
              <div className="text-sm text-gray-600">注册 KOL</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.verifiedKOLs}</div>
              <div className="text-sm text-gray-600">已验证</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                ${(stats.totalVolume / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">总交易量</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">{stats.platformsSupported}</div>
              <div className="text-sm text-gray-600">支持平台</div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>zkTLS 隐私验证</CardTitle>
              <CardDescription>
                使用零知识证明技术验证身份和数据，保护用户隐私的同时确保真实性
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Twitter 身份验证
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  Binance 交易数据
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  隐私完全保护
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>信用等级系统</CardTitle>
              <CardDescription>
                基于多维度数据分析的 5 级信用评分体系，公平评价 KOL 影响力
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  交易技能评估
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  社交影响力
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  内容质量分析
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>代币激励机制</CardTitle>
              <CardDescription>
                通过 VIBE 代币奖励优质内容创作和社区贡献，构建可持续生态
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  验证奖励 100 VIBE
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  内容创作奖励
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  社区治理权益
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            如何开始
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-semibold mb-2">连接钱包</h3>
              <p className="text-sm text-gray-600">
                连接您的 MetaMask 钱包开始使用平台功能
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-semibold mb-2">完成验证</h3>
              <p className="text-sm text-gray-600">
                通过 zkTLS 验证您的 Twitter 和交易所账户
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-semibold mb-2">获得认证</h3>
              <p className="text-sm text-gray-600">
                基于验证数据获得信用评分和认证徽章
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="font-semibold mb-2">开始收益</h3>
              <p className="text-sm text-gray-600">
                通过优质内容和影响力获得 VIBE 代币奖励
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              准备好成为认证 KOL 了吗？
            </h2>
            <p className="text-purple-100 mb-6">
              加入我们的去中心化影响力验证生态，开启您的 Web3 创作者之旅
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/verify">
                <Button size="lg" variant="secondary">
                  开始验证身份
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                  查看文档
                  <Globe className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}