FROM node:16

ENV MIX_ENV=prod
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./
COPY mix.exs .
COPY mix.lock .

RUN npm install
RUN mix deps.get

ENV NODE_ENV=production

COPY . .

EXPOSE 8090

CMD ["npm", "start"]