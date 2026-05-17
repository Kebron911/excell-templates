# syntax=docker/dockerfile:1.7

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.6.0 --activate
RUN apk add --no-cache tini

FROM base AS builder
WORKDIR /repo
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages packages/
COPY STRListingAudit-Tools/package.json STRListingAudit-Tools/
RUN pnpm install --frozen-lockfile --filter "strlistingaudit-tools..."
COPY STRListingAudit-Tools STRListingAudit-Tools/
RUN pnpm --filter strlistingaudit-tools server:build

FROM base AS runtime
WORKDIR /app
COPY --from=builder --chown=node:node /repo /app
USER node
WORKDIR /app/STRListingAudit-Tools
ENV NODE_ENV=production PORT=3002
EXPOSE 3002
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server/dist/index.js"]
