# this image relies on the nodejs image
FROM node:20-alpine
# set working directory
WORKDIR /usr/src/shopping-carts-service
# we need CURL to verify that the key-value storage is running (see boot-in-order.sh)
RUN apk update && apk add curl

# let NPM packages be called anywhere within the container
ENV PATH /usr/src/shopping-carts/node_modules/.bin:${PATH}
ADD package.json .
RUN npm install
# source files of the shopping carts service
ADD gulpfile.js .
ADD src src
ADD boot-in-order.sh .

# we now use an script to deploy the shopping carts service
CMD source boot-in-order.sh