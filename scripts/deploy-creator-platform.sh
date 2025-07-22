#!/bin/bash

# Deploy CreatorPlatform to Monad Testnet
echo "Deploying CreatorPlatform to Monad Testnet..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "Error: .env file not found. Please create one with PRIVATE_KEY."
    exit 1
fi

# Load environment variables
source .env

# Check if PRIVATE_KEY is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "Error: PRIVATE_KEY not set in .env file."
    exit 1
fi

# Navigate to contract directory
cd contract || exit

# Deploy contracts
echo "Deploying CreatorPlatform contracts..."
forge script script/DeployCreatorPlatform.s.sol:DeployCreatorPlatform \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --broadcast \
    --verify \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    -vvv

echo "Deployment completed!"