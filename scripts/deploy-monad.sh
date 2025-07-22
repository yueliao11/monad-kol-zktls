#!/bin/bash

# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
  echo "Error: PRIVATE_KEY is not set in .env file"
  exit 1
fi

# Real Primus contract address on Monad Testnet
export PRIMUS_CONTRACT_ADDRESS="0x1Ad7fD53206fDc3979C672C0466A1c48AF47B431"

echo "Deploying contracts to Monad Testnet..."
echo "RPC URL: $RPC_URL"
echo "Primus Contract: $PRIMUS_CONTRACT_ADDRESS"

cd contract && export PATH="$PATH:$HOME/.foundry/bin" && forge script script/DeployV2.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify \
  -vvv