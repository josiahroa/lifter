FROM node:24-alpine3.22

WORKDIR /usr/src/app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/db ./packages/db
COPY backend/package.json ./backend/

RUN pnpm install --filter @lifter/backend --frozen-lockfile


COPY backend ./backend

WORKDIR /usr/src/app/backend
RUN pnpm build

RUN pnpm prune --prod

EXPOSE 3000
CMD ["node", "dist/main"]