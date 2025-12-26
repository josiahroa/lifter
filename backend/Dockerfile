FROM node:24-alpine3.22

WORKDIR /usr/src/app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages ./packages
COPY backend/package.json ./backend/

RUN pnpm install --filter @lifter/backend --frozen-lockfile

COPY backend ./backend

# Build all packages that the backend depends on, then build the backend
WORKDIR /usr/src/app
RUN pnpm --filter @lifter/backend... build

WORKDIR /usr/src/app/backend
RUN pnpm prune --prod

EXPOSE 3000
CMD ["node", "dist/main"]