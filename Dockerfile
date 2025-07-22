# Stage 1: Application Build
FROM node:20-alpine AS builder

# Install necessary build dependencies
RUN apk add --no-cache g++ make py3-pip curl

WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install all dependencies, including devDependencies
RUN npm ci --legacy-peer-deps && npm cache clean --force

# Set environment variables at build time
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

# Copy source code
COPY . .

# Build the application
RUN npm run build -- --configuration=${NODE_ENV}

# Stage 2: Final Image
FROM nginx:alpine

# Remove default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy built files from the build stage
COPY --from=builder /app/dist/busbox-ui /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Create logs directory
RUN mkdir -p /etc/nginx/logs && \
   touch /etc/nginx/logs/error.log /etc/nginx/logs/access.log

# Install curl for healthcheck
RUN apk add --no-cache curl

# Configure healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
 CMD curl -f http://localhost:80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
