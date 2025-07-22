# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

**X Web3 KOL Platform** - 基于 zkTLS 的 Web3 KOL 影响力验证平台，通过验证多平台 KOL 身份和交易资质，实现个性化代币发行和粉丝经济体系。

### 核心功能
- **多平台身份验证**: 支持 Twitter、Quora、Medium、Binance、OKX 等平台的 zkTLS 验证
- **创作者等级系统**: 基于影响力和信用分数的 5 级等级体系
- **个性化代币发行**: 高等级创作者可发行专属 ERC-20 代币
- **内容激励机制**: 基于内容质量和互动数据的自动化奖励分发
- **ERC-6551 集成**: 每个创作者拥有独立的链上钱包账户

## 技术栈

- **前端框架**: Next.js 14.1.0 + TypeScript (App Router)
- **UI 组件库**: Shadcn UI + Tailwind CSS + Radix UI
- **Web3 集成**: Ethers.js v6
- **智能合约**: Foundry (Solidity 0.8.20)
- **密码学层**: Primus SDK (zkTLS/zkFHE) 文档： @docs/primus.md
- **包管理器**: Bun (workspace 配置)
- **构建工具**: Next.js 内置构建系统

## 常用命令

### 完整开发流程
```bash
# 1. 安装所有依赖 (前端 + 智能合约)
make install

# 2. 启动本地区块链 (Terminal 1)
make anvil

# 3. 部署智能合约到本地 (Terminal 2)
make deploy-local-v2

# 4. 启动前端开发服务器 (Terminal 3)
make dev

# 5. 运行合约测试 (Monad Testnet fork)
make test
```

### 核心 Makefile 命令
```bash
# 查看所有可用命令
make help

# 构建生产版本
make build

# 清理构建缓存
make clean

# 从模板创建环境变量文件
make setup-env
```

### 前端开发命令
```bash
# 在 app/ 目录下运行
cd app

# 开发服务器
bun dev

# 生产构建
bun run build

# 代码检查
bun run lint

# 类型检查
bun run type-check
```

### 智能合约开发 (Foundry)
```bash
# 在 contract/ 目录下运行
cd contract

# 安装合约依赖
forge install

# 编译合约
forge build

# 运行测试 (详细输出)
forge test -vvv

# 运行特定测试
forge test --match-test testName

# 检查测试覆盖率
forge coverage
```

## 项目结构

### Monorepo 架构
```
Root/
├── app/                 # Next.js 前端应用
├── contract/            # Foundry 智能合约工作空间
├── scripts/            # 自动化脚本 (Anvil, 部署)
├── docs/               # 文档 (Primus SDK 指南)
├── Makefile           # 统一构建系统
└── package.json       # Workspace 配置
```

### 前端架构 (`/app`)
- `/app/page.tsx` - 主应用入口点
- `/components/` - 可复用的 React 组件 (Shadcn UI)
- `/lib/` - 工具函数和 Primus SDK 集成
- `/hooks/` - zkTLS 和代币申领的自定义 React hooks
- `/api/zktls/config/` - 服务端凭据处理端点

### 智能合约 (`/contract`)
- `/src/` - Solidity 智能合约源码
- `/script/` - 部署脚本
- `/test/` - 合约测试 (Forge)
- `/foundry.toml` - Foundry 配置

## 核心应用流程

### zkTLS Twitter 验证流程
1. **用户连接 MetaMask 钱包**
2. **Twitter 身份验证**:
   - 前端调用 Primus SDK 初始化
   - 生成 attestation 请求
   - 用户在不泄露凭据的情况下证明 Twitter 所有权
   - 生成并验证 zkTLS 证明
3. **代币申领**:
   - 将验证后的 attestation 提交到智能合约
   - 合约通过 Primus 合约验证证明
   - 一次性分发 100 VIBE 代币 (每用户/Twitter 账户)

### Primus SDK 集成要点
- 支持 Proxy TLS 和 MPC TLS 两种模式 (默认使用 Proxy TLS)
- 需要从 Primus Developer Hub 获取 appID 和 appSecret
- 认证结果包含接收者、请求详情、响应数据和签名
- Next.js SSR 兼容性：使用动态导入 `await import('@primuslabs/zktls-js-sdk')`

## 重要开发规范

### 代码风格
- 代码必须极其简短，但完美完成任务
- UI 风格要求简洁优雅大气
- 追求用最少代码实现 100% 功能

### 环境变量处理
- 绝不直接读写 `.env` 文件
- 参考 `.env.template` 了解所需变量
- 编写防御式代码检测环境变量配置
- monorepo 场景下使用根目录 `.env`，必要时通过 Makefile 复制

### Primus SDK 使用注意
- 配置验证参数时注意选择合适的 zkTLS 模式
- 验证所有认证签名后才能信任数据

## 支持的区块链
- Monad Testnet

## 网络信息
### Monad Testnet
- **网络名称**: Monad Testnet
- **Chain ID**: 10143
- **货币符号**: MON
- **区块浏览器**: https://testnet.monadexplorer.com

### 公共 RPC 端点
| RPC URL | 提供者 | 请求限制 | 批处理调用限制 | 其他限制 |
|---------|--------|----------|----------------|----------|
| https://testnet-rpc.monad.xyz | QuickNode | 25 请求/秒 | 100 | - |
| https://rpc.ankr.com/monad_testnet | Ankr | 300 请求/10 秒，12000 请求/10 分钟 | 100 | 不允许 debug_* 方法 |
| https://rpc-testnet.monadinfra.com | Monad Foundation | 20 请求/秒 | 不允许 | 不允许 eth_getLogs 和 debug_* 方法 |

## AI 开发辅助信息

### 常见开发问题和解决方案
1. **环境配置问题**: Primus SDK 需要正确的 appId/appSecret，使用 `/api/zktls/config` 端点安全传递
2. **客户端兼容性**: Next.js SSR 环境下使用动态导入：`await import('@primuslabs/zktls-js-sdk')`
3. **数据解析问题**: Twitter API 使用固定模板 ID 和 JSON Path `$.screen_name`
4. **双重申领防护**: 智能合约通过 mapping 防止同一钱包或 Twitter 账户多次申领
5. **测试网络**: 使用 Anvil 进行本地测试，支持 Monad Testnet 分叉

### 关键配置参数
- **Monad Testnet Primus 合约**: `0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431`
- **X Web3 KOL 应用 ID**: `0x65ca3a593ef6044a8bd7070326da05b2bd4faa1b`
- **应用密钥**: `0xd09fb9867ec58f44bca320c431369a810c0195d1164c8d063a578746336f8be4`
- **X (Twitter) 验证模板 ID**: `2e3160ae-8b1e-45e3-8c59-426366278b9d`