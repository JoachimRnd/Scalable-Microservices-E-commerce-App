# this image relies on the nodejs image
FROM node:20-alpine
# set working directory
WORKDIR /usr/src/products-service
# we need CURL to verify that the key-value storage is running (see boot-in-order.sh)
RUN apk update && apk add curl

# let NPM packages be called anywhere within the container
ENV PATH /usr/src/products-service/node_modules/.bin:${PATH}
ENV AZURE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=scapplinfo2145;AccountKey=4ncIZul7Nq8TpyZzGse7fid1Y9cV4iEEzpVW78kavIUJHyAGzB/0NMWpJxbjbHAjWLuI0URSUF8a+ASt6eMkNg==;EndpointSuffix=core.windows.net

ADD package.json .
RUN npm install
# source files of the products service
ADD gulpfile.js .
ADD src src
ADD boot-in-order.sh .
ADD db-init.js .
ADD db-init.json .
ADD func_to_string.js .

# we now use an script to deploy the products service
CMD source boot-in-order.sh