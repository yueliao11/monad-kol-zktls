# 🚀 Vercel 部署指南

## 📋 项目信息

**项目名称**: X Web3 KOL Platform  
**智能合约地址**: `0x91a44beCCBd69f04414202e7E538d845C4F85b7a`  
**网络**: Monad Testnet (Chain ID: 10143)  
**部署者地址**: `0x032D72BE3256c989792d8Cc8C0c406f50E52a2f2`

## 🔧 Vercel 部署步骤

### 1. 准备仓库
确保你的代码已经推送到 GitHub 仓库。

### 2. 连接 Vercel
1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账户登录
3. 点击 "New Project"
4. 选择你的 GitHub 仓库

### 3. 配置项目设置
在 Vercel 项目设置中：

**Framework Preset**: Next.js  
**Root Directory**: 选择 `app` 目录  
**Build Command**: `npm run build`  
**Output Directory**: `.next`  
**Install Command**: `npm install`  

### 4. 配置环境变量
在 Vercel 项目设置的 "Environment Variables" 中添加以下变量：

```bash
# 必需的环境变量 - 在 Vercel 控制台中逐个添加
NEXT_PUBLIC_CONTRACT_ADDRESS=0x91a44beCCBd69f04414202e7E538d845C4F85b7a
NEXT_PUBLIC_VIBE_TOKEN_ADDRESS=0x91a44beCCBd69f04414202e7E538d845C4F85b7a
NEXT_PUBLIC_PRIMUS_APP_ID=0x65ca3a593ef6044a8bd7070326da05b2bd4faa1b
NEXT_PUBLIC_RPC_URL=https://testnet-rpc.monad.xyz
PRIMUS_APP_SECRET=0xd09fb9867ec58f44bca320c431369a810c0195d1164c8d063a578746336f8be4
```

⚠️ **重要**: 
- 所有环境变量都要在 Vercel 控制台中手动添加
- 不要在代码仓库中提交敏感信息
- **NEXT_PUBLIC_APP_URL** 会自动设置为你的 Vercel 域名

### 5. 部署
点击 "Deploy" 按钮开始部署。

## 🌐 项目功能

### 核心功能
- **🔐 zkTLS 验证**: Twitter 和币安账户验证
- **👑 KOL 申请系统**: 基于真实数据的 KOL 认证
- **🪙 代币奖励**: 成功申请获得 300 VIBE 代币
- **📊 信誉评分**: 多维度的 KOL 信誉评估
- **🔄 跟单交易**: 一键跟随优质 KOL

### 技术栈
- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **智能合约**: Solidity + Foundry
- **zkTLS**: Primus SDK
- **区块链**: Monad Testnet

## 🔧 本地开发

### 环境要求
- Node.js 18+
- Bun (推荐) 或 npm
- Foundry (智能合约开发)

### 快速开始
```bash
# 1. 克隆项目
git clone <your-repo-url>
cd vibe-zktls-example-main

# 2. 安装依赖
make install

# 3. 启动开发服务器
make dev
```

### 可用命令
```bash
make help           # 查看所有命令
make install        # 安装依赖
make dev           # 启动开发服务器
make build         # 构建生产版本
make deploy-monad  # 部署合约到 Monad 测试网
make test          # 运行合约测试
```

## 📱 用户指南

### 如何申请成为 KOL
1. **连接钱包**: 确保使用支持 Monad 测试网的钱包
2. **填写基本信息**: 用户名和个人简介（最少50字符）
3. **完成验证**:
   - **Twitter 验证**: 使用 zkTLS 验证 Twitter 账户所有权
   - **币安验证**: 验证 30 天现货交易量
4. **设置质押**: 质押至少 1000 VIBE 代币作为信誉保证金
5. **提交申请**: 成功后获得 300 VIBE 代币奖励

### 网络配置
添加 Monad 测试网到你的钱包：

```
网络名称: Monad Testnet
RPC URL: https://testnet-rpc.monad.xyz
Chain ID: 10143
货币符号: MON
区块浏览器: https://testnet.monadexplorer.com
```

## 🚨 重要提醒

1. **私钥安全**: 永远不要在前端或公共仓库中暴露私钥
2. **测试网络**: 项目目前运行在 Monad 测试网，请使用测试代币
3. **备份数据**: 重要的交易记录请做好备份

## 🛠️ 故障排除

### 常见部署问题

#### 1. 安全漏洞警告
```
1 critical severity vulnerability
```
**解决方案**: 
- 警告来自过时的依赖，已在最新版本修复
- 运行 `npm audit fix` 或更新到最新依赖版本

#### 2. ESLint 版本警告
```
npm warn deprecated eslint@8.57.1
```
**解决方案**: 
- 已更新到 ESLint v9
- 确保使用最新的 package.json

#### 3. 构建路径错误
```
Error: Cannot find module './app/.next'
```
**解决方案**: 
- 确认 Vercel 项目设置中：
  - Build Command: `cd app && npm run build`
  - Output Directory: `app/.next`
  - Install Command: `npm install && cd app && npm install`

#### 4. 环境变量未加载
**解决方案**: 
- 在 Vercel 控制台手动添加所有环境变量
- 重新部署项目
- 检查变量名拼写是否正确

#### 5. API 路由 404 错误
**解决方案**: 
- 确认 API 路由在 `app/app/api/` 目录下
- 检查 vercel.json 中的函数路径配置

### 性能优化建议

1. **启用压缩**: Vercel 自动启用 gzip 压缩
2. **图片优化**: 使用 Next.js Image 组件
3. **缓存策略**: 配置适当的缓存头
4. **边缘函数**: 将 API 路由部署到边缘位置

## 📞 支持

如果在部署或使用过程中遇到问题：
1. 检查环境变量配置是否正确
2. 确认网络连接和 RPC 端点可用
3. 查看浏览器控制台的错误信息
4. 参考上述故障排除指南
5. 查看 Vercel 部署日志获取详细错误信息

## 🔗 相关链接

- [Monad 测试网信息](https://docs.monad.xyz)
- [Primus SDK 文档](https://docs.primus.xyz)
- [Vercel 部署文档](https://vercel.com/docs)

---

**合约地址**: `0x91a44beCCBd69f04414202e7E538d845C4F85b7a`  
**网络**: Monad Testnet  
**版本**: v2.0.0