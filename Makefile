.PHONY: help install dev build test deploy-local-v2 deploy-monad clean

help:
	@echo "Available commands:"
	@echo "  make install         - Install all dependencies"
	@echo "  make dev            - Start development server"
	@echo "  make build          - Build production app"
	@echo "  make test           - Run contract tests"
	@echo "  make anvil          - Start local Anvil fork"
	@echo "  make deploy-local-v2 - Deploy V2 contracts to local Anvil"
	@echo "  make deploy-monad    - Deploy contracts to Monad testnet"
	@echo "  make clean          - Clean build artifacts"

install:
	@if command -v bun >/dev/null 2>&1; then \
		echo "Using Bun..."; \
		bun install; \
	else \
		echo "Bun not found, using npm..."; \
		npm install; \
	fi
	cd contract && if command -v forge >/dev/null 2>&1; then \
		forge install; \
	else \
		echo "Forge not found, skipping contract dependencies"; \
	fi

dev:
	@if command -v bun >/dev/null 2>&1; then \
		cd app && bun dev; \
	else \
		cd app && npm run dev; \
	fi

build:
	@if command -v bun >/dev/null 2>&1; then \
		cd app && bun run build; \
	else \
		cd app && npm run build; \
	fi

test:
	cd contract && forge test -vvv

anvil:
	./scripts/start-anvil.sh

deploy-local-v2:
	./scripts/deploy-local-v2.sh

deploy-creator-platform:
	./scripts/deploy-creator-platform.sh

deploy-monad:
	./scripts/deploy-monad.sh

clean:
	rm -rf node_modules
	rm -rf app/node_modules app/.next
	rm -rf contract/cache contract/out

setup-env:
	@if [ ! -f .env ]; then \
		cp .env.template .env; \
		echo "Created .env file from template. Please update with your values."; \
	else \
		echo ".env file already exists."; \
	fi