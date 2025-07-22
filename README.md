# X Web3 KOL Platform

基于 zkTLS 技术的 Web3 KOL 影响力验证平台，通过隐私保护的方式验证多平台 KOL 身份，实现个性化代币发行和粉丝经济体系。

## 🌟 项目特色

- **隐私保护验证**: 使用 Primus zkTLS 技术验证 KOL 身份，不泄露敏感信息
- **多平台支持**: 支持 X (Twitter)、Quora、Medium、Binance、OKX 等平台验证
- **KOL 等级系统**: 基于影响力和信用分数的 5 级等级体系
- **个性化代币**: 高等级 KOL 可发行专属 ERC-20 代币
- **内容激励**: 基于内容质量和互动数据的自动化奖励分发
- **ERC-6551 集成**: 每个 KOL 拥有独立的链上身份钱包

## 🚀 快速开始

### 环境要求

- Node.js 18+
- Bun (推荐) 或 npm
- Foundry (智能合约开发)
- MetaMask 钱包

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd vibe-zktls-example-main
```

2. **安装依赖**
```bash
make install
```

3. **配置环境变量**
```bash
# 复制环境变量模板
cp app/.env.template app/.env.local

# 编辑环境变量（已预配置 X Web3 KOL 应用参数）
vim app/.env.local
```

4. **启动开发环境**
```bash
# Terminal 1: 启动本地区块链
make anvil

# Terminal 2: 部署智能合约
make deploy-creator-platform

# Terminal 3: 启动前端应用
make dev
```

## 📋 Primus 应用配置

本项目已配置 X Web3 KOL 应用：

- **应用名称**: x web3 KOL
- **Application ID**: `0x65ca3a593ef6044a8bd7070326da05b2bd4faa1b`
- **Secret Key**: `0xd09fb9867ec58f44bca320c431369a810c0195d1164c8d063a578746336f8be4`

### 模板配置

目前支持的验证模板：
- **X (Twitter)**: `2e3160ae-8b1e-45e3-8c59-426366278b9d` ✅ 已配置
- **Quora**: 待配置
- **Medium**: 待配置  
- **Binance**: 待配置
- **OKX**: 待配置

## 🏗️ 项目架构

### 智能合约

- **CreatorRegistry**: KOL 注册和多平台验证管理
- **TokenFactory**: 个性化代币发行工厂
- **ContentRewards**: 内容激励和奖励分发
- **ERC6551Integration**: 链上钱包和 NFT 身份绑定
- **CreatorPlatform**: 统一的平台入口合约

### 前端应用

- **多平台验证**: 支持 5 个平台的 zkTLS 验证流程
- **KOL 仪表板**: 展示等级、分数和权益状态
- **代币管理**: 创建和管理个人代币
- **内容管理**: 创建内容并跟踪奖励
- **ERC-6551 管理**: 链上钱包创建和管理

## 🔧 开发命令

```bash
# 查看所有可用命令
make help

# 开发相关
make install          # 安装所有依赖
make dev             # 启动前端开发服务器
make build           # 构建生产版本

# 智能合约相关
make anvil           # 启动本地区块链
make deploy-creator-platform  # 部署新平台合约
make test            # 运行合约测试

# 清理
make clean           # 清理构建缓存
```

## 🌐 网络信息

### Monad Testnet
- **网络名称**: Monad Testnet
- **Chain ID**: 10143
- **货币符号**: MON
- **RPC URL**: https://testnet-rpc.monad.xyz
- **区块浏览器**: https://testnet.monadexplorer.com
- **Primus 合约**: `0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431`

## 📊 KOL 等级体系

| 等级 | 名称 | 最低分数 | 权益 |
|------|------|----------|------|
| 1 | 新手 KOL | 0 | 基础功能 |
| 2 | 活跃 KOL | 250 | 奖励倍数提升 |
| 3 | 专业 KOL | 500 | 代币发行权限 |
| 4 | 影响力 KOL | 750 | 独家功能 |
| 5 | 顶级 KOL | 1000 | 所有功能 + 治理权 |

## 🔐 安全注意事项

- **生产环境**: 绝不在前端代码中暴露 `appSecret`
- **环境变量**: 使用 `.env.local` 存储敏感信息
- **密钥管理**: 妥善保管 Primus 应用密钥
- **智能合约**: 部署前进行充分测试

## 📚 技术文档

- [Primus SDK 文档](./docs/primus.md)
- [智能合约架构](./contract/README.md)
- [前端组件说明](./app/README.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如遇到问题，请：
1. 查看 [常见问题](./docs/FAQ.md)
2. 提交 [Issue](https://github.com/your-repo/issues)
3. 联系开发团队

---

*Built with ❤️ using zkTLS technology*