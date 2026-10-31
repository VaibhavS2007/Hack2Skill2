# ==========================================
# Multi-stage Dockerfile for Google Cloud Run
# ==========================================

# 1. Builder Stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./
RUN npm ci

# Copy full source
COPY . .

# Run test suite to verify build integrity
RUN npm run test

# Compile production bundle
RUN npm run build

# 2. Production Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Install production-only dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled assets and server
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.js ./server.js

# Google Cloud Run listens on PORT environment variable (default: 8080)
EXPOSE 8080

# Run lightweight production web server
CMD ["node", "server.js"]
