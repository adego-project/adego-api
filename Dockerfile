# Build stage
FROM node:20-alpine AS builder

LABEL maintainer="https://suk.kr"

WORKDIR /app
COPY . /app

RUN yarn install --frozen-lockfile --prod
RUN yarn run build

# Production stage
FROM node:20-alpine

ENV TZ=Asia/Seoul

WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start:prod"]
