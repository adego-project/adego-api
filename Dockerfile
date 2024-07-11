FROM node:18-alpine

LABEL maintainer="https://suk.kr"

ENV TZ=Asia/Seoul

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

RUN npx prisma generate

COPY . .

RUN yarn run build

CMD ["yarn", "start:prod"]