# syntax=docker/dockerfile:1
# Multi-stage build. Compatible with both Docker and Podman.
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY src ./src
COPY tsconfig.json ./

RUN npm run build

FROM node:20-slim

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/build ./build

COPY package.json package-lock.json ./

RUN npm ci --omit=dev

USER node

# Twitter/X credentials are NOT baked into the image. Pass them at run time, e.g.:
#   podman run -i --rm \
#     -e API_KEY=... \
#     -e API_SECRET_KEY=... \
#     -e ACCESS_TOKEN=... \
#     -e ACCESS_TOKEN_SECRET=... \
#     twitter-mcp
# Optional search backends (used by search_tweets when configured):
#   -e XQUIK_API_KEY=... -e XQUIK_BASE_URL=...
#   -e GETXAPI_API_KEY=... -e GETXAPI_BASE_URL=...

CMD ["node", "build/universal-installer.js", "--stdio"]
