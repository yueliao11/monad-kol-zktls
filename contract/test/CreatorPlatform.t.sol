// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import "../src/CreatorPlatform.sol";
import "../src/CreatorRegistry.sol";
import {IPrimusZKTLS, Attestation} from "@primuslabs/zktls-contracts/src/IPrimusZKTLS.sol";

contract CreatorPlatformTest is Test {
    CreatorPlatform public platform;
    CreatorRegistry public registry;
    TokenFactory public factory;
    ContentRewards public rewards;
    
    address public primusAddress = 0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431;
    address public creator1 = address(0x1);
    address public creator2 = address(0x2);
    address public feeRecipient = address(0x3);
    
    function setUp() public {
        // Fork Monad Testnet
        string memory monadRpc = "https://testnet-rpc.monad.xyz";
        vm.createFork(monadRpc);
        
        // Deploy platform
        platform = new CreatorPlatform(primusAddress, 250, feeRecipient);
        
        // Get contract addresses
        (
            address registryAddress,
            address factoryAddress,
            address rewardsAddress
        ) = platform.getContractAddresses();
        
        registry = CreatorRegistry(registryAddress);
        factory = TokenFactory(factoryAddress);
        rewards = ContentRewards(rewardsAddress);
        
        // Fund test accounts
        vm.deal(creator1, 1 ether);
        vm.deal(creator2, 1 ether);
    }
    
    function testPlatformDeployment() public {
        assertEq(address(platform.registry()), address(registry));
        assertEq(address(platform.factory()), address(factory));
        assertEq(address(platform.rewards()), address(rewards));
        assertEq(platform.primusAddress(), primusAddress);
        assertEq(platform.platformFee(), 250);
        assertEq(platform.feeRecipient(), feeRecipient);
    }
    
    function testCreatorRegistration() public {
        // Mock attestation data
        Attestation memory attestation = _createMockAttestation(
            creator1,
            '{"screen_name": "testuser", "followers": "1000", "posts": "100", "likes": "5000"}'
        );
        
        vm.prank(creator1);
        vm.expectEmit(true, true, false, true);
        emit CreatorRegistry.CreatorRegistered(creator1, "twitter", "testuser");
        
        // This would normally call Primus contract, but we'll mock it
        vm.mockCall(
            primusAddress,
            abi.encodeWithSelector(IPrimusZKTLS.verifyAttestation.selector),
            abi.encode(true)
        );
        
        registry.verifyPlatform(attestation, CreatorRegistry.PlatformType.TWITTER);
        
        // Verify creator profile
        (
            address wallet,
            string[] memory verifiedPlatforms,
            uint256 credibilityScore,
            uint256 creatorLevel,
            address personalToken,
            bool canIssueTokens,
            uint256 verifiedAt
        ) = registry.getCreatorProfile(creator1);
        
        assertEq(wallet, creator1);
        assertEq(verifiedPlatforms.length, 1);
        assertEq(verifiedPlatforms[0], "twitter");
        assertGt(credibilityScore, 0);
        assertEq(creatorLevel, 1);
        assertEq(personalToken, address(0));
        assertEq(canIssueTokens, false);
        assertGt(verifiedAt, 0);
    }
    
    function testMultiPlatformVerification() public {
        // Verify Twitter first
        Attestation memory twitterAttestation = _createMockAttestation(
            creator1,
            '{"screen_name": "testuser", "followers": "1000", "posts": "100", "likes": "5000"}'
        );
        
        vm.mockCall(
            primusAddress,
            abi.encodeWithSelector(IPrimusZKTLS.verifyAttestation.selector),
            abi.encode(true)
        );
        
        vm.prank(creator1);
        registry.verifyPlatform(twitterAttestation, CreatorRegistry.PlatformType.TWITTER);
        
        // Verify Quora
        Attestation memory quoraAttestation = _createMockAttestation(
            creator1,
            '{"username": "testuser", "followers": "500", "answers": "50", "upvotes": "2000"}'
        );
        
        vm.prank(creator1);
        registry.verifyPlatform(quoraAttestation, CreatorRegistry.PlatformType.QUORA);
        
        // Check updated profile
        (
            ,
            string[] memory verifiedPlatforms,
            uint256 credibilityScore,
            uint256 creatorLevel,
            ,
            ,
        ) = registry.getCreatorProfile(creator1);
        
        assertEq(verifiedPlatforms.length, 2);
        assertGt(credibilityScore, 100); // Should be higher than single platform
        assertGe(creatorLevel, 2); // Should be at least level 2
    }
    
    function testTokenCreation() public {
        // First, verify creator and get to level 3
        _setupHighLevelCreator(creator1);
        
        // Create creator token
        vm.prank(creator1);
        address tokenAddress = factory.createCreatorToken("TestToken", "TEST");
        
        assertNotEq(tokenAddress, address(0));
        assertEq(factory.getCreatorToken(creator1), tokenAddress);
        
        // Verify token properties
        CreatorToken token = CreatorToken(tokenAddress);
        assertEq(token.name(), "TestToken");
        assertEq(token.symbol(), "TEST");
        assertEq(token.creator(), creator1);
        assertEq(token.balanceOf(creator1), 1000000 * 10**18); // Initial supply
    }
    
    function testContentCreationAndRewards() public {
        // Setup creator and token
        _setupHighLevelCreator(creator1);
        
        vm.prank(creator1);
        address tokenAddress = factory.createCreatorToken("TestToken", "TEST");
        
        // Fund reward pool
        vm.prank(creator1);
        CreatorToken(tokenAddress).approve(address(rewards), 10000 * 10**18);
        
        vm.prank(creator1);
        rewards.fundRewardPool(10000 * 10**18);
        
        // Create content
        vm.prank(creator1);
        bytes32 contentId = rewards.createContent(
            "QmTestHash",
            "Test Article",
            "medium"
        );
        
        // Verify content creation
        (
            address creator,
            string memory contentHash,
            string memory title,
            string memory platform,
            uint256 createdAt,
            uint256 rewardAmount,
            uint256 views,
            uint256 likes,
            uint256 shares,
            bool isRewarded
        ) = rewards.getContentInfo(contentId);
        
        assertEq(creator, creator1);
        assertEq(contentHash, "QmTestHash");
        assertEq(title, "Test Article");
        assertEq(platform, "medium");
        assertGt(createdAt, 0);
        assertEq(rewardAmount, 0);
        assertEq(views, 0);
        assertEq(likes, 0);
        assertEq(shares, 0);
        assertEq(isRewarded, false);
    }
    
    function _createMockAttestation(
        address recipient,
        string memory data
    ) internal pure returns (Attestation memory) {
        return Attestation({
            recipient: recipient,
            data: data,
            timestamp: block.timestamp,
            signature: new bytes(65) // Mock signature
        });
    }
    
    function _setupHighLevelCreator(address creator) internal {
        // Mock multiple platform verifications to reach level 3
        vm.mockCall(
            primusAddress,
            abi.encodeWithSelector(IPrimusZKTLS.verifyAttestation.selector),
            abi.encode(true)
        );
        
        // Twitter
        Attestation memory twitterAttestation = _createMockAttestation(
            creator,
            '{"screen_name": "testuser", "followers": "5000", "posts": "500", "likes": "25000"}'
        );
        
        vm.prank(creator);
        registry.verifyPlatform(twitterAttestation, CreatorRegistry.PlatformType.TWITTER);
        
        // Quora
        Attestation memory quoraAttestation = _createMockAttestation(
            creator,
            '{"username": "testuser", "followers": "2000", "answers": "200", "upvotes": "10000"}'
        );
        
        vm.prank(creator);
        registry.verifyPlatform(quoraAttestation, CreatorRegistry.PlatformType.QUORA);
        
        // Binance
        Attestation memory binanceAttestation = _createMockAttestation(
            creator,
            '{"accountId": "testuser", "vip_level": "3", "balance": "50000"}'
        );
        
        vm.prank(creator);
        registry.verifyPlatform(binanceAttestation, CreatorRegistry.PlatformType.BINANCE);
    }
}