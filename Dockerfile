# ---------- Base ----------
FROM node:24-alpine AS base

RUN apk add --no-cache git


# ---------- Dependencies ----------
FROM base AS deps

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci


# ---------- Build ----------
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npx prisma generate

RUN npm run build


# ---------- Web ----------
FROM base AS web

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]


# ---------- Worker ----------
FROM base AS worker

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/worker ./worker
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

CMD ["npm", "run", "worker"]