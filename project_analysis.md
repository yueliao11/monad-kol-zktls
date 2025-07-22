
# Vibe zkTLS 项目分析

## 概述

Vibe zkTLS 是一个基于 Monad 测试网的代币分发系统，它利用 zkTLS 技术对用户的 Twitter 账户进行验证。验证通过后，用户可以领取 100 个 VIBE 代币。

## 技术栈

*   **前端**: Next.js, TypeScript, Shadcn UI
*   **智能合约**: Foundry, Solidity
*   **zkTLS**: Primus SDK
*   **区块链**: Monad Testnet

## 项目结构

这是一个 `npm` workspaces monorepo，包含两个主要部分：

*   `app`: Next.js 前端应用。
*   `contract`: Foundry 智能合约项目。

### 前端 (`app`)

前端是一个 Next.js 应用，负责用户交互、钱包连接和与智能合约的交互。

*   **主要库**:
    *   `next`: React 框架。
    *   `ethers`: 与以太坊区块链交互的库。
    *   `@primuslabs/zktls-js-sdk`: 用于 zkTLS 验证的 Primus SDK。
    *   `@radix-ui/react-dialog`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`: 用于构建 UI 组件。
*   **关键组件**:
    *   `TwitterVerification.tsx`: 处理 Twitter 验证流程的 UI 组件。
*   **Hooks**:
    *   `useTokenClaim.ts`: 处理代币领取的逻辑。
    *   `useZKTLS.ts`: 封装了与 Primus SDK 的交互。
*   **API 路由**:
    *   `/api/zktls/config`: 获取 zkTLS 配置。
    *   `/api/zktls/verify`: 验证 zkTLS 证明。

### 智能合约 (`contract`)

智能合约使用 Foundry 开发，并部署在 Monad 测试网上。

*   **核心合约**:
    *   `VibeTokenV2.sol`: 项目的第二个版本，集成了 Primus zkTLS 验证。它继承自一个标准的 `ERC20` 合约和一个 `Ownable` 合约。
*   **主要功能**:
    *   `claimTokens(Attestation calldata attestation)`: 用户调用此函数来领取 VIBE 代币。它需要一个 `Attestation` 对象作为参数，该对象由 Primus SDK 生成。
    *   **验证流程**:
        1.  检查用户是否已经领取过代币。
        2.  调用 Primus 合约的 `verifyAttestation` 函数来验证证明。
        3.  验证证明的接收者是否是调用者。
        4.  从证明数据中提取 Twitter `screen_name`，并检查该 `screen_name` 是否已被使用。
        5.  如果所有检查都通过，则向用户转移 100 个 VIBE 代币。
*   **辅助合约**:
    *   `ERC20.sol`: 标准的 ERC20 代币实现。
    *   `Ownable.sol`: 实现所有权控制。
    *   `JsonParser.sol`: 一个用于从 JSON 字符串中提取值的库。

## zkTLS 流程

1.  用户连接他们的 MetaMask 钱包。
2.  用户通过 Primus SDK 授权他们的 Twitter 账户。
3.  Primus SDK 生成一个 zkTLS 证明，证明用户拥有该 Twitter 账户。
4.  前端将此证明提交给 `VibeTokenV2` 智能合约的 `claimTokens` 函数。
5.  智能合约与 Primus 合约交互以验证该证明。
6.  如果验证成功，用户将收到 100 个 VIBE 代币。

## 本地开发

项目的 `README.md` 提供了详细的本地开发设置说明。主要步骤包括：

1.  设置环境变量。
2.  安装依赖项。
3.  启动本地 Anvil fork。
4.  部署智能合约到本地 Anvil fork。
5.  启动 Next.js 开发服务器。

## 总结

Vibe zkTLS 是一个很好的例子，展示了如何使用 zkTLS 和智能合约来构建一个去中心化的身份验证和代币分发系统。该项目结构清晰，代码编写良好，并且利用了最新的 Web3 技术。
