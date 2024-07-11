FROM node:18-alpine

LABEL maintainer="https://suk.kr"

ENV TZ=Asia/Seoul

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn run postinstall
RUN yarn run build

CMD ["yarn", "start:prod"]