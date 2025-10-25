# Makefile for various SSH and Docker operations

# Variables
SSH_DIR := $(HOME)/.ssh

# Phony targets
.PHONY: all copy-id-pub copy-id img-prune build-dev serve server dev help

# Default target
all: help

# Copy public SSH key to clipboard
copy-id-pub:
	@pbcopy < $(SSH_DIR)/id_rsa.pub
	@echo "Public key copied to clipboard"

# Copy private SSH key to clipboard
copy-id:
	@pbcopy < $(SSH_DIR)/id_rsa
	@echo "Private key copied to clipboard"

# Remove all unused Docker images
img-prune:
	@docker image prune -af
	@echo "Unused Docker images removed"

# Build application in development mode
build-dev:
	@echo "Building application in development mode..."
	@doppler run --config dev -- npm run build -- --configuration=development

# Run Angular dev server (ng serve) with Doppler
serve:
	@doppler run --config dev -- npm start

# Run SSR Express server (requires build first!)
server:
	@if [ ! -f "dist/busbox-ui/server/server.mjs" ]; then \
		echo "⚠️  Server files not found. Running build first..."; \
		$(MAKE) build-dev; \
	fi
	@echo "Starting SSR server on http://localhost:4000"
	@doppler run --config dev -- npm run serve:ssr:busbox-ui

# Run both ng serve and SSR server in parallel
dev:
	@echo "Starting full development environment..."
	@echo "  - Angular dev server (ng serve) on http://localhost:4200"
	@echo "  - SSR Express server on http://localhost:4000"
	@if [ ! -f "dist/busbox-ui/server/server.mjs" ]; then \
		echo "Building application first..."; \
		$(MAKE) build-dev; \
	fi
	@doppler run --config dev -- bash -c 'npm start & npm run serve:ssr:busbox-ui'

# Help target
help:
	@echo "Available targets:"
	@echo "  copy-id-pub  - Copy public SSH key to clipboard"
	@echo "  copy-id      - Copy private SSH key to clipboard"
	@echo "  img-prune    - Remove all unused Docker images"
	@echo "  build-dev    - Build application in development mode"
	@echo "  serve        - Run Angular dev server (ng serve) on :4200"
	@echo "  server       - Run SSR Express server on :4000"
	@echo "  dev          - Run both servers in parallel (full dev environment)"
	@echo "  help         - Show this help message"
