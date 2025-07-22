'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Book, 
  Shield, 
  Code, 
  Zap, 
  Users, 
  ExternalLink,
  Github,
  FileText,
  Terminal,
  Globe,
  Wallet,
  TrendingUp,
  Award,
  Key,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function DocsPage() {
  const codeExample = `// 使用 zkTLS 验证 Twitter 身份
import { useZKTLS } from '@/hooks/useZKTLS';

const { startZKTLSVerification } = useZKTLS();

const verifyTwitter = async () => {
  const result = await startZKTLSVerification({
    type: 'social',
    platform: 'twitter',
    templateId: '2e3160ae-8b1e-45e3-8c59-426366278b9d'
  });
  
  if (result.success) {
    console.log('验证成功！', result.attestation);
  }
};`;

  const contractExample = `// 智能合约集成示例
pragma solidity ^0.8.20;

import "@primuslabs/zktls-contracts/src/IPrimusZKTLS.sol";

contract KOLPlatform {
    IPrimusZKTLS public primusVerifier;
    
    function verifyKOL(Attestation calldata attestation) external {
        require(
            primusVerifier.verifyAttestation(attestation),
            "Invalid attestation"
        );
        
        // KOL 验证成功逻辑
        _registerKOL(msg.sender, attestation);
    }
}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Book className="h-8 w-8 mr-3 text-purple-600" />
            开发者文档
          </h1>
          <p className="text-gray-600">
            了解如何使用 zkTLS 技术构建去中心化的 KOL 影响力验证平台
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">zkTLS</div>
              <div className="text-sm text-gray-600">核心技术</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600">支持平台</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">ERC-20</div>
              <div className="text-sm text-gray-600">代币标准</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">Monad</div>
              <div className="text-sm text-gray-600">部署网络</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">项目概述</TabsTrigger>
            <TabsTrigger value="architecture">技术架构</TabsTrigger>
            <TabsTrigger value="api">API 文档</TabsTrigger>
            <TabsTrigger value="contracts">智能合约</TabsTrigger>
            <TabsTrigger value="deployment">部署指南</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Project Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  X Web3 KOL Platform
                </CardTitle>
                <CardDescription>基于 zkTLS 的 Web3 KOL 影响力验证平台</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  本平台通过零知识传输层安全（zkTLS）技术，实现多平台 KOL 身份和交易资质的隐私保护验证，
                  支持个性化代币发行和基于信用分数的等级体系，构建真实可信的粉丝经济生态。
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                      核心特性
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• 多平台身份验证 (Twitter, Binance, OKX)</li>
                      <li>• 创作者等级系统 (5 级信用评分)</li>
                      <li>• 个性化代币发行 (ERC-20)</li>
                      <li>• 内容激励机制</li>
                      <li>• ERC-6551 钱包集成</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center">
                      <Shield className="h-4 w-4 mr-2 text-blue-600" />
                      技术优势
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• 零知识证明保护隐私</li>
                      <li>• 不可篡改的链上验证</li>
                      <li>• 去中心化身份管理</li>
                      <li>• 跨平台数据整合</li>
                      <li>• 实时信用评分更新</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>工作原理</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Wallet className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-medium mb-2">1. 连接钱包</h4>
                    <p className="text-xs text-gray-600">连接 MetaMask 开始验证流程</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-medium mb-2">2. zkTLS 验证</h4>
                    <p className="text-xs text-gray-600">隐私保护的平台身份验证</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-medium mb-2">3. 信用评分</h4>
                    <p className="text-xs text-gray-600">基于验证数据生成信用分数</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="font-medium mb-2">4. 获得奖励</h4>
                    <p className="text-xs text-gray-600">领取 VIBE 代币和认证徽章</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Use Cases */}
            <Card>
              <CardHeader>
                <CardTitle>应用场景</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      KOL 认证
                    </h4>
                    <p className="text-sm text-gray-600">
                      通过多平台验证建立可信的 KOL 身份，获得平台认证和等级提升
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      投资跟单
                    </h4>
                    <p className="text-sm text-gray-600">
                      基于真实交易数据的智能跟单系统，降低投资风险
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Zap className="h-4 w-4 mr-2" />
                      内容变现
                    </h4>
                    <p className="text-sm text-gray-600">
                      通过优质内容获得代币奖励，建立可持续的收入模式
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-6">
            {/* System Architecture */}
            <Card>
              <CardHeader>
                <CardTitle>系统架构</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-blue-900">前端层</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Next.js 14 + TypeScript</li>
                        <li>• Shadcn UI + Tailwind CSS</li>
                        <li>• Web3 钱包集成</li>
                        <li>• 响应式设计</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-green-900">服务层</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>• Primus zkTLS SDK</li>
                        <li>• API 路由处理</li>
                        <li>• 验证签名服务</li>
                        <li>• 数据聚合逻辑</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold mb-2 text-purple-900">区块链层</h4>
                      <ul className="text-sm text-purple-800 space-y-1">
                        <li>• Monad Testnet</li>
                        <li>• ERC-20 代币合约</li>
                        <li>• Primus 验证合约</li>
                        <li>• 信用评分系统</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-semibold mb-3">数据流程</h4>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        用户请求
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        zkTLS 验证
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        链上确认
                      </div>
                      <div className="text-gray-400">→</div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                        奖励分发
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technology Stack */}
            <Card>
              <CardHeader>
                <CardTitle>技术栈详情</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">前端技术</h4>
                    <div className="space-y-2">
                      {[
                        { name: 'Next.js 14', desc: 'React 全栈框架', badge: 'Framework' },
                        { name: 'TypeScript', desc: '类型安全', badge: 'Language' },
                        { name: 'Tailwind CSS', desc: '原子化 CSS', badge: 'Styling' },
                        { name: 'Ethers.js', desc: 'Web3 交互库', badge: 'Web3' }
                      ].map(tech => (
                        <div key={tech.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{tech.name}</span>
                            <span className="text-sm text-gray-600 ml-2">{tech.desc}</span>
                          </div>
                          <Badge variant="outline">{tech.badge}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">区块链技术</h4>
                    <div className="space-y-2">
                      {[
                        { name: 'Solidity', desc: '智能合约语言', badge: 'Language' },
                        { name: 'Foundry', desc: '开发工具链', badge: 'Toolchain' },
                        { name: 'Primus SDK', desc: 'zkTLS 集成', badge: 'zkTLS' },
                        { name: 'Monad', desc: '高性能 EVM', badge: 'Network' }
                      ].map(tech => (
                        <div key={tech.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">{tech.name}</span>
                            <span className="text-sm text-gray-600 ml-2">{tech.desc}</span>
                          </div>
                          <Badge variant="outline">{tech.badge}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            {/* API Overview */}
            <Card>
              <CardHeader>
                <CardTitle>API 接口文档</CardTitle>
                <CardDescription>平台提供的主要 API 接口和使用方法</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-medium">POST /api/zktls/sign</span>
                      <Badge>认证</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">签署 zkTLS 证明请求</p>
                    <div className="text-xs bg-gray-100 p-2 rounded">
                      参数: signParams (证明参数)
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-medium">POST /api/zktls/verify</span>
                      <Badge variant="outline">验证</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">验证 zkTLS 证明结果</p>
                    <div className="text-xs bg-gray-100 p-2 rounded">
                      参数: attestation (验证证明)
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-medium">GET /api/zktls/config</span>
                      <Badge variant="secondary">配置</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">获取 zkTLS 配置信息</p>
                    <div className="text-xs bg-gray-100 p-2 rounded">
                      返回: appId, templateIds 等配置
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Examples */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  代码示例
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">前端 zkTLS 集成</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{codeExample}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">React Hook 使用</h4>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`const { isLoading, error, verifyTwitter } = useZKTLS();

// 在组件中使用
const handleVerify = async () => {
  try {
    await verifyTwitter(userAddress);
    alert('验证成功！');
  } catch (err) {
    console.error('验证失败:', err);
  }
};`}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contracts" className="space-y-6">
            {/* Contract Overview */}
            <Card>
              <CardHeader>
                <CardTitle>智能合约</CardTitle>
                <CardDescription>平台核心智能合约及其功能</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">VIBE Token Contract</h4>
                      <p className="text-sm text-gray-600 mb-2">ERC-20 代币合约，用于平台奖励和治理</p>
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                        0x91a44beCCBd69f04414202e7E538d845C4F85b7a
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Primus Verifier</h4>
                      <p className="text-sm text-gray-600 mb-2">zkTLS 验证合约，处理证明验证</p>
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded">
                        0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                      <span className="font-medium text-yellow-800">网络信息</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      合约部署在 Monad Testnet (Chain ID: 10143)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract Integration */}
            <Card>
              <CardHeader>
                <CardTitle>合约集成示例</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{contractExample}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Network Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>网络配置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">网络名称:</span>
                      <span className="ml-2">Monad Testnet</span>
                    </div>
                    <div>
                      <span className="font-medium">Chain ID:</span>
                      <span className="ml-2">10143</span>
                    </div>
                    <div>
                      <span className="font-medium">货币符号:</span>
                      <span className="ml-2">MON</span>
                    </div>
                    <div>
                      <span className="font-medium">区块浏览器:</span>
                      <a href="https://testnet.monadexplorer.com" target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                        testnet.monadexplorer.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-100 rounded">
                    <h5 className="font-medium mb-2">RPC 端点</h5>
                    <div className="text-sm space-y-1">
                      <div>• https://testnet-rpc.monad.xyz (推荐)</div>
                      <div>• https://rpc.ankr.com/monad_testnet</div>
                      <div>• https://rpc-testnet.monadinfra.com</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deployment" className="space-y-6">
            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="h-5 w-5 mr-2" />
                  快速开始
                </CardTitle>
                <CardDescription>从零开始部署和运行平台</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <h4 className="text-white font-medium mb-2">1. 克隆项目</h4>
                    <code className="text-green-400 text-sm">
                      git clone https://github.com/your-repo/vibe-zktls-platform.git<br/>
                      cd vibe-zktls-platform
                    </code>
                  </div>
                  
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <h4 className="text-white font-medium mb-2">2. 安装依赖</h4>
                    <code className="text-green-400 text-sm">
                      make install  # 安装所有依赖
                    </code>
                  </div>
                  
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <h4 className="text-white font-medium mb-2">3. 配置环境</h4>
                    <code className="text-green-400 text-sm">
                      make setup-env  # 创建环境变量文件<br/>
                      # 编辑 .env 文件，添加必要的 API 密钥
                    </code>
                  </div>
                  
                  <div className="p-4 bg-gray-900 rounded-lg">
                    <h4 className="text-white font-medium mb-2">4. 启动开发环境</h4>
                    <code className="text-green-400 text-sm">
                      make anvil     # Terminal 1: 启动本地区块链<br/>
                      make deploy-local-v2  # Terminal 2: 部署合约<br/>
                      make dev       # Terminal 3: 启动前端
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Environment Variables */}
            <Card>
              <CardHeader>
                <CardTitle>环境变量配置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-100 rounded">
                    <h5 className="font-medium mb-2">必需变量</h5>
                    <div className="text-sm font-mono space-y-1">
                      <div>NEXT_PUBLIC_PRIMUS_APP_ID=0x65ca3a593ef6044a8bd7070326da05b2bd4faa1b</div>
                      <div>PRIMUS_APP_SECRET=0xd09fb9867ec58f44bca320c431369a810c0195d1164c8d063a578746336f8be4</div>
                      <div>NEXT_PUBLIC_VIBE_TOKEN_ADDRESS=0x91a44beCCBd69f04414202e7E538d845C4F85b7a</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded">
                    <h5 className="font-medium mb-2 text-blue-800">可选变量</h5>
                    <div className="text-sm font-mono space-y-1 text-blue-700">
                      <div>NEXT_PUBLIC_MONAD_RPC_URL=https://testnet-rpc.monad.xyz</div>
                      <div>NEXT_PUBLIC_ENABLE_ANALYTICS=false</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deployment Options */}
            <Card>
              <CardHeader>
                <CardTitle>部署选项</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Vercel 部署
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">推荐的生产环境部署方式</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="h-3 w-3 mr-2" />
                      部署到 Vercel
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Terminal className="h-4 w-4 mr-2" />
                      本地开发
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">完整的本地开发环境</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <FileText className="h-3 w-3 mr-2" />
                      查看文档
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Github className="h-4 w-4 mr-2" />
                      Docker 部署
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">容器化部署方案</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Code className="h-3 w-3 mr-2" />
                      Dockerfile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Troubleshooting */}
            <Card>
              <CardHeader>
                <CardTitle>常见问题</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border-l-4 border-yellow-400 bg-yellow-50">
                    <h5 className="font-medium text-yellow-800 mb-1">zkTLS 验证失败</h5>
                    <p className="text-sm text-yellow-700">
                      确保已登录对应平台账户，并允许弹窗和跨域请求
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-red-400 bg-red-50">
                    <h5 className="font-medium text-red-800 mb-1">合约交互失败</h5>
                    <p className="text-sm text-red-700">
                      检查网络配置是否正确，确保连接到 Monad Testnet
                    </p>
                  </div>
                  
                  <div className="p-3 border-l-4 border-blue-400 bg-blue-50">
                    <h5 className="font-medium text-blue-800 mb-1">构建错误</h5>
                    <p className="text-sm text-blue-700">
                      运行 npm run type-check 检查类型错误，确保所有依赖已安装
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="mt-8">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">需要帮助？</h3>
            <p className="text-gray-600 mb-4">
              如果您在使用过程中遇到问题，欢迎通过以下方式联系我们
            </p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="sm">
                <Github className="h-4 w-4 mr-2" />
                GitHub Issues
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                技术文档
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}