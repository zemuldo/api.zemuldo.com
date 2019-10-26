FROM node:alpine

WORKDIR /usr/src/app

RUN apk add inotify-tools

COPY package*.json ./

RUN npm install

RUN npm i -g pm2

COPY . .


EXPOSE 8090