# this image relies on the nodejs image
FROM node:20-alpine
# set working directory
WORKDIR /usr/src/orders-service
# we need CURL to verify that the key-value storage is running (see boot-in-order.sh)
RUN apk update && apk add curl

# let NPM packages be called anywhere within the container
ENV PATH /usr/src/orders-service/node_modules/.bin:${PATH}
ADD package.json .
RUN npm install
# source files of the orders service
ADD gulpfile.js .
ADD src src
ADD boot-in-order.sh .
ADD func_to_string.js .

# we now use an script to deploy the orders service
CMD source boot-in-order.sh