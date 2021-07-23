# Install dependencies only when needed
FROM node:14-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /work/frontend
COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /work/frontend
COPY ./frontend/ .
COPY --from=deps /work/frontend/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /work/frontend

ARG NODE_ENV ${NODE_ENV:-production}
ENV NODE_ENV $NODE_ENV
RUN echo $NODE_ENV

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /work/frontend/next.config.js ./
# COPY --from=builder /work/frontend/public ./public
# COPY --from=builder --chown=nextjs:nodejs /work/frontend/.next ./.next
# COPY --from=builder /work/frontend/node_modules ./node_modules
# COPY --from=builder /work/frontend/package.json ./package.json
COPY ./frontend/ .
COPY --from=deps /work/frontend/node_modules ./node_modules

USER nextjs


EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

# CMD ["yarn", "start"]
CMD sh -c "yarn run build && /bin/sh"
# CMD sh -c "yarn run build && yarn run start && /bin/sh"