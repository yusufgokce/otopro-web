# ── Stage 1: Install dependencies ────────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# ── Stage 2: Build the app ────────────────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

ARG BUILD_COMMIT_SHA
ENV BUILD_COMMIT_SHA=$BUILD_COMMIT_SHA

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ── Stage 3: Production runner ────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

ARG BUILD_COMMIT_SHA
ENV BUILD_COMMIT_SHA=$BUILD_COMMIT_SHA

# Non-root user — mirrors innera's appuser pattern
RUN addgroup --system --gid 1001 appuser && \
    adduser --system --uid 1001 --ingroup appuser appuser

# Standalone output only — no node_modules in final image
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
