# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (needed for build)
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Stage 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Set build-time environment variables (only non-secret vars)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Build the application with SSR
# Note: Angular build doesn't need API keys - they're only used in runtime!
RUN npm run build -- --configuration=${NODE_ENV}

# Stage 3: Production dependencies only
FROM node:20-alpine AS prod-deps

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies (ignore scripts like husky prepare)
RUN npm ci --legacy-peer-deps --omit=dev --ignore-scripts && npm cache clean --force

# Stage 4: Runtime
FROM node:20-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR /app

# Copy production dependencies
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy built application (both browser and server)
COPY --from=builder /app/dist/busbox-ui ./dist/busbox-ui

# Copy package.json for potential runtime needs
COPY package*.json ./

# Set runtime environment variables (non-secret only)
ENV NODE_ENV=production
ENV PORT=4000

# Set SSR_BASE_URL for Angular SSR to make requests to itself
ENV SSR_BASE_URL=http://localhost:4000

# ⚠️ Secrets should be injected at runtime via:
# docker run -e APP_API_BASE_URL=... -e APP_API_KEY=... -e APP_MAP_KEY=...
# or Kubernetes secrets / docker-compose env_file
# DO NOT use ARG for secrets as they will be stored in image layers!

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose SSR server port
EXPOSE 4000

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start the SSR server
CMD ["node", "dist/busbox-ui/server/server.mjs"]
