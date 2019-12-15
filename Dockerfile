FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

ENV NODE_ENV=production

COPY . .

EXPOSE 8090

CMD ["npm", "start"]