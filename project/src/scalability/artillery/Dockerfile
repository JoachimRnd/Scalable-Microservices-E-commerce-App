# this image relies on the nodejs image
FROM node:20-alpine

WORKDIR /usr/src/artillery

RUN apk update && apk add curl
RUN npm install artillery

# let NPM packages be called anywhere within the container
ENV PATH /usr/src/artillery/node_modules/.bin:${PATH}

ADD users-daemon-load-test.yml .
ADD orders-daemon-load-test.yml .
ADD shopping-carts-daemon-load-test.yml .
ADD products-daemon-load-test.yml .

ADD entrypoints/entrypoints-users.sh .
ADD entrypoints/entrypoints-orders.sh .
ADD entrypoints/entrypoints-products.sh .
ADD entrypoints/entrypoints-shopping-carts.sh .
