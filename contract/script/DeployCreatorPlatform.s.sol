// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import "../src/CreatorPlatform.sol";

contract DeployCreatorPlatform is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        // Monad Testnet Primus contract address
        address primusAddress = 0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431;
        
        // Platform configuration
        uint256 platformFee = 250; // 2.5%
        address feeRecipient = deployer; // Change to treasury address in production
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy CreatorPlatform (which deploys all other contracts)
        CreatorPlatform platform = new CreatorPlatform(
            primusAddress,
            platformFee,
            feeRecipient
        );
        
        console.log("CreatorPlatform deployed at:", address(platform));
        
        // Get deployed contract addresses
        (
            address registryAddress,
            address factoryAddress,
            address rewardsAddress
        ) = platform.getContractAddresses();
        
        console.log("CreatorRegistry deployed at:", registryAddress);
        console.log("TokenFactory deployed at:", factoryAddress);
        console.log("ContentRewards deployed at:", rewardsAddress);
        
        vm.stopBroadcast();
        
        // Log deployment summary
        console.log("=== Deployment Summary ===");
        console.log("Deployer:", deployer);
        console.log("Primus Address:", primusAddress);
        console.log("Platform Fee:", platformFee, "basis points");
        console.log("Fee Recipient:", feeRecipient);
        console.log("========================");
    }
}