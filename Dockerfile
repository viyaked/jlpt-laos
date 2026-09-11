# Multi-stage build for optimal image size and security
FROM node:22-bookworm-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Runner
FROM node:22-bookworm-slim AS runner
WORKDIR /app


ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
RUN npm ci --omit=dev && npm install -g tsx

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Persistent database storage mount point
VOLUME ["/app/server/data"]

EXPOSE 3001
CMD ["tsx", "server/index.ts"]
