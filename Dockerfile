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

# Set build-time environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG APP_API_BASE_URL
ENV APP_API_BASE_URL=${APP_API_BASE_URL}

ARG APP_API_KEY
ENV APP_API_KEY=${APP_API_KEY}

ARG APP_MAP_KEY
ENV APP_MAP_KEY=${APP_MAP_KEY}

ARG APP_IMAGE_PROVIDER_URL
ENV APP_IMAGE_PROVIDER_URL=${APP_IMAGE_PROVIDER_URL}

ARG DOPPLER_CONFIG
ENV DOPPLER_CONFIG=${DOPPLER_CONFIG}

# Build the application with SSR
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

# Set runtime environment variables
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG APP_API_BASE_URL
ENV APP_API_BASE_URL=${APP_API_BASE_URL}

ARG APP_API_KEY
ENV APP_API_KEY=${APP_API_KEY}

ARG APP_MAP_KEY
ENV APP_MAP_KEY=${APP_MAP_KEY}

ARG APP_IMAGE_PROVIDER_URL
ENV APP_IMAGE_PROVIDER_URL=${APP_IMAGE_PROVIDER_URL}

#ARG API_REFRESH_URL
#ENV API_REFRESH_URL=${API_REFRESH_URL}

ARG DOPPLER_CONFIG
ENV DOPPLER_CONFIG=${DOPPLER_CONFIG}

# Set PORT
ENV PORT=4000

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
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/health || exit 1

# Start the SSR server
CMD ["node", "dist/busbox-ui/server/server.mjs"]
