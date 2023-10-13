FROM node:20-bullseye AS build

WORKDIR /app

COPY package.json ./

RUN npm install
COPY . ./

ENV PUBLIC_AUTH_SERVICE_URL=http://localhost:3001

RUN npm run build

CMD node build
