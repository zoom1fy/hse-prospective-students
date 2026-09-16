# syntax=docker/dockerfile:1

# # ---- Dependencies ---------------------------------------------------------
# FROM oven/bun:1.4 AS deps
# WORKDIR /app
# COPY package.json bun.lock ./
# RUN bun install --frozen-lockfile

# ---- Build ----------------------------------------------------------------
FROM oven/bun:1.4 AS builder
ENV NODE_OPTIONS="--max-old-space-size=4096"
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# COPY /app/node_modules ./node_modules
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# ---- Runtime --------------------------------------------------------------
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt update
RUN apt install curl -y

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000

# CMD ["node", "node_modules/next/dist/bin/next", "start"]

CMD ["node", "server.js"]
