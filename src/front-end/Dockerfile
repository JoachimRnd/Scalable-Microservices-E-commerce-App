FROM node:20-alpine AS build

WORKDIR /app

COPY package.json ./

RUN npm install
COPY . ./

ENV PUBLIC_SERVICE_URL=http://192.168.56.101:3001

RUN npm run build

CMD node build
