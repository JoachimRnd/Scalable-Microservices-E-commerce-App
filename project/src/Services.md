# Table of content 

- [Table of content](#table-of-content)
- [Services](#services)
  - [Frontend service](#frontend-service)
    - [Role of the service](#role-of-the-service)
    - [Associated technologies](#associated-technologies)
    - [How to build the container](#how-to-build-the-container)
    - [API of the service](#api-of-the-service)
  - [Authentification service](#authentification-service)
    - [Role of the service](#role-of-the-service-1)
    - [Associated technologies](#associated-technologies-1)
    - [How to build the container](#how-to-build-the-container-1)
    - [API of the service](#api-of-the-service-1)
  - [Order service](#order-service)
    - [Role of the service](#role-of-the-service-2)
    - [Associated technologies](#associated-technologies-2)
    - [How to build the container](#how-to-build-the-container-2)
    - [API of the service](#api-of-the-service-2)
  - [Shopping cart service](#shopping-cart-service)
    - [Role of the service](#role-of-the-service-3)
    - [Associated technologies](#associated-technologies-3)
    - [How to build the container](#how-to-build-the-container-3)
    - [API of the service](#api-of-the-service-3)
  - [Product service](#product-service)
    - [Role of the service](#role-of-the-service-4)
    - [Associated technologies](#associated-technologies-4)
    - [How to build the container](#how-to-build-the-container-4)
    - [API of the service](#api-of-the-service-4)
  - [Logging service](#logging-service)
    - [Role of the service](#role-of-the-service-5)
    - [Associated technologies](#associated-technologies-5)
    - [How to build the container](#how-to-build-the-container-5)
    - [API of the service](#api-of-the-service-5)
  - [Gateway service](#gateway-service)
    - [Role of the service](#role-of-the-service-6)
    - [Associated technologies](#associated-technologies-6)
    - [How to build the container](#how-to-build-the-container-6)
- [Swarm](#swarm)
  - [How to run a swarm of instances](#how-to-run-a-swarm-of-instances)

# Services

## Frontend service

### Role of the service

The Frontend service is use to provide the user interface of the application to 
the user. It is a svelte application that is served by a nodejs server.

### Associated technologies

This service use different technologies to provide the user interface:

- **Svelte**: A javascript framework to build reactive user interfaces. 
- **Nodejs**: A javascript runtime environment.
- **Docker**: A containerization platform to build and run the application in a 
  consistent environment across different platforms.


### How to build the container

To build the container for the frontend service, run the following command in 
the project directory:

:heavy_exclamation_mark: If you do not have the your docker id exported in a `DOCKER_ID` variable
in your environment, you can either export it or uncomment the `DOCKER_ID` variable
in the [Makefile](../Makefile) and set it to your docker id.

```bash
# To build and push to docker hub the entire frontend service
make frontend 

# To only build the frontend container
make frontend-build

# To only push the frontend container to docker hub
make frontend-push
```
To run the frontend you can use the following command but it will run the entire swarm
of containers with the frontend:

```bash
# To run the entire swarm of containers or reload (removing old swarm)
make swarm-deploy
make swarm-reload

# To run the entire swarm of containers with elastic scaling or reload (removing old swarm)
make swarm-deploy-with-elastic
make swarm-reload-with-elastic

```

### API of the service

<!--  -->


## Authentification service

### Role of the service

The authentification service is used to manage the users of the application. It is composed of a REST API and a database. The REST API is used to create and read users from the
database.

### Associated technologies

This service use different technologies to provide an authentification but mainly:
- **Gulp**: A javascript task runner to build the application.
- **JWT**: A javascript library to generate and verify JSON Web Tokens, very userful for stateless applications.

### How to build the container

To build the container for the user service, run the following command in
the project directory:

:heavy_exclamation_mark: If you do not have the your docker id exported in a `DOCKER_ID` variable in your environment, you can either export it or uncomment the `DOCKER_ID` variable

```bash
# To build and push to docker hub the entire user service
make auth

# To only build the user container
make auth-build

# To only push the user container to docker hub
make auth-push
```

### API of the service

The authentification service has two commands:
- **POST /user**: Create a new user in the database. The body of the request must be a json object with the following fields:
  - ***status***: The status of the request (success, error). 
  - ***username***: The username of the user.
  - ***password***: The password of the user.

  If the user is created successfully, the service will return a json object with the following fields:
  - ***token***: The token for this user valid for 14 days. Containing the creating time, the expiration date, the username and his role.  

- **GET /user/:username/:password**: If the username and password are correct, the service will return a json object with the following fields:
  - ***status***: The status of the request (success, error).
  - ***data***:  
    - ***token***: The token for this user valid for 14 days. Containing the creating time, the expiration date, the username and his role.
    - ***role***: The role of the user (admin, user).

In case of error, the service will return a json object with the following fields:
- ***message***: The error message.
  
<!--  -->

## Order service

### Role of the service

The Order service is responsible for managing orders within the application. It provides a REST API for creating and retrieving orders, and it interacts with a database to store order information. The service ensures that orders are associated with the correct user by utilizing an authentication middleware.

### Associated technologies

- **Node.js** and **Express**: The service is built using Node.js and the Express framework to handle HTTP requests and manage routes.
- **CouchDB**: A NoSQL database used for storing order information. Views are created within CouchDB to facilitate queries related to user-specific orders.
- **Gulp**: A javascript task runner to build the application.
- **JWT**: A javascript library to generate and verify JSON Web Tokens, very userful for stateless applications, used in this case to check the role of the user (using the provided token).

### How to build the container

To build the container for the order service, run the following command in
the project directory:

```bash
# Build and push the entire Order service to Docker Hub
make orders

# Build only the Order service container
make orders-build

# Push only the Order service container to Docker Hub
make orders-push
```

### API of the service

The Order service exposes two routes:

- **POST /checkout**: Create a new order in the database for the authenticated user. The body of the request must be a json object with the following fields:
  - ***items***: An array of json objects containing the orders. Each item has the following fields:
    - ***id***: The id of the order.
    - ***quantity***: The quantity of the item to checkout.
  - ***extras***: A json object containing the extras information about the order.
    - ***totalQuantity***: The total quantity of the order.
    - ***totalPrice***: The total price of the order.
    - ***date***: The date of the order.

- **GET /user/orders**: Retrieves all orders associated with the authenticated user. The service returns a JSON object with the following fields:
  - ***status***: The status of the request (success, error).
  - ***_id***: The id of the order given by the `CouchDB`.
  - ***_rev***: The revision of the order given by the `CouchDB`.
  - ***userId***: The id of the user who did the checkout.
  - ***items***: An array of json objects containing the orders. Each order has the following fields:
    - ***id***: The id of the order.
    - ***quantity***: The quantity of the item. 
  - ***extras***: A json object containing the extras information about the order.
    - ***totalQuantity***: The total quantity of items in the order.
    - ***totalPrice***: The total price of the order.
    - ***date***: The date of the order.

In case of error, the service will return a json object with the following fields:
- ***message***: The error message.
- ***status***: The status of the request (success, error).

<!--  -->

## Shopping cart service

### Role of the service

### Associated technologies

### How to build the container

### API of the service


<!--  -->

## Product service

### Role of the service

The product service is used to manage the products of the application. It is composed of a REST API and a database. The REST API is used to create, read, update and delete products from the database. 

### Associated technologies

This service use different technologies mainly:
- **Node.js** and **Express**: The service is built using Node.js and the Express framework to handle HTTP requests and manage routes.
- **CouchDB**: A NoSQL database used for storing order information. Views are created within CouchDB to facilitate queries related to user-specific orders.
- **Gulp**: A javascript task runner to build the application.
- **JWT**: A javascript library to generate and verify JSON Web Tokens, very userful for stateless applications, used in this case to check the role of the user (using the provided token).

### How to build the container

To build the container for the product service, run the following command in
the project directory:

:heavy_exclamation_mark: If you do not have the your docker id exported in a `DOCKER_ID` variable in your environment, you can either export it or uncomment the `DOCKER_ID` variable

```bash
# To build and push to docker hub the entire product service
make products

# To only build the product container
make products-build

# To only push the product container to docker hub
make products-push
```


### API of the service

The product service has five routes:

- **GET /products**: Get all the products from the database. The service will return a json object with the following fields:
  - ***status***: The status of the request (success, error).
  - ***data***: An array of json objects containing the products. Each product has the following fields:
    - ***_id***: The id of the product given by the `CouchDB`.
    - ***_rev***: The revision of the product given by the `CouchDB`.
    - ***name***: The name of the product.
    - ***price***: The price of the product.
    - ***image***: The image of the product as URL.
    - ***category***: The category of the product.

- **GET /products/id**: Get all the products from the database with the given ids.
  - ***productsId***: The id of the products to get from the database.
  
  The service will return a json object with the following fields:
  - ***status***: The status of the request (success, error).
  - ***data***: An array of json objects containing the products. Each product has the following fields:
    - ***_id***: The id of the product given by the `CouchDB`.
    - ***_rev***: The revision of the product given by the `CouchDB`.
    - ***name***: The name of the product.
    - ***price***: The price of the product.
    - ***image***: The image of the product as URL.
    - ***category***: The category of the product.

- **POST /products**: Create a new product in the database. The body of the request must be a json object with the following fields:
  - ***product***:
    - ***name***: The name of the product.
    - ***price***: The price of the product.
    - ***image***: The image of the product as URL.
    - ***category***: The category of the product.
  :heavy_exclamation_mark: To post a product you must be an admin and provide a valid token in the header of the request.

  If the product is created successfully, the service will return a json object with the following fields:
  - ***status***: The status of the request (success, error).
  - ***data***: An array of json objects containing the products. Each product has the following fields:
    - ***_id***: The id of the product given by the `CouchDB`.
    - ***_rev***: The revision of the product given by the `CouchDB`.
    - ***name***: The name of the product.
    - ***price***: The price of the product.
    - ***image***: The image of the product as URL.
    - ***category***: The category of the product.

- **PUT /products**: Update a product in the database. The body of the request must be a json object with the following fields:
  - ***product***:
    - ***_id***: The id of the product given by the `CouchDB`.
    - ***_rev***: The revision of the product given by the `CouchDB`.
    - ***name***: The name of the product.
    - ***price***: The price of the product.
    - ***image***: The image of the product as URL.
    - ***category***: The category of the product.
  :heavy_exclamation_mark: To put a product you must be an admin and provide a valid token in the header of the request.

  If the product is updated successfully, the service will return a json object with the following fields:
  - ***status***: The status of the request (success, error).
  - ***data***: An array of json objects containing the products. Each product has the following fields:
    - ***_id***: The id of the product given by the `CouchDB`.
    - ***_rev***: The revision of the product given by the `CouchDB`.
    - ***name***: The name of the product.
    - ***price***: The price of the product.
    - ***image***: The image of the product as URL.
    - ***category***: The category of the product.

- **DELETE /products**: Delete a product in the database. The body of the request must be a json object with the following fields:
  - ***product***:
    - ***_id***: The id of the product given by the `CouchDB`.
    - ***_rev***: The revision of the product given by the `CouchDB`.
  :heavy_exclamation_mark: To delete a product you must be an admin and provide a valid token in the header of the request.

  If the product is deleted successfully, the service will return a json object with the following fields:
  - ***status***: The status of the request (success, error).
  - ***data***: An array of json objects containing the products. Each product has the following fields:
    - ***_id***: The id of the product given by the `CouchDB`.
    - ***_rev***: The revision of the product given by the `CouchDB`.
    - ***name***: The name of the product.
    - ***price***: The price of the product.
    - ***image***: The image of the product as URL.
    - ***category***: The category of the product.

In case of error, the service will return a json object with the following fields:
- ***message***: The error message.
- ***status***: The status of the request (success, error).

<!--  -->

## Logging service

### Role of the service

The logging of the logging service is to log the requests made by the other microservices. It is composed of a REST API and a database. The REST API is used to create and read logs from the database.

### Associated technologies

This service use different technologies to provide an authentification but mainly:
- **Node.js** and **Express**: The service is built using Node.js and the Express framework to handle HTTP requests and manage routes.
- **CouchDB**: A NoSQL database used for storing order information. Views are created within CouchDB to facilitate queries related to user-specific orders.
- **Gulp**: A javascript task runner to build the application.
- **JWT**: A javascript library to generate and verify JSON Web Tokens, very userful for stateless applications, used in this case to check the role of the user (using the provided token).

### How to build the container

To build the container for the logging service, run the following command in
the project directory:

:heavy_exclamation_mark: If you do not have the your docker id exported in a `DOCKER_ID` variable in your environment, you can either export it or uncomment the `DOCKER_ID` variable

```bash
# To build and push to docker hub the entire logging service
make logger

# To only build the logging container
make logger-build

# To only push the logging container to docker hub
make logger-push
```

### API of the service

The logging service has nine routes, but 3 main routes:

:heavy_exclamation_mark: To be more concise, the two following routes will use the variable `:name_of_the_service` to refer to the name of the service that made the request. I.e ùser, products, orders, shopping-carts. According to the name of the service, the logger will log the request in the corresponding database.

- **POST /logger/:name_of_the_service/info**: Log an info message. The body of the request must be a json object with the following fields:
  - ***message***: The message to log.
  - ***data***: The data to log.
    - ***userId***: The id of the user that made the request, if not given the userId will be set to unknown.
    - ***OPTIONNAL***: Any other data to log.

  If the post is successful, the service will return a json object with the following fields:
  - ***status***: The status of the request (success, error).
  - ***message***: The success message from the CouchDB.

- **POST /logger/:name_of_the_service/error**: Log an error message. The body of the request must be a json object with the following fields:
  - ***message***: The message to log.
  - ***data***: The data to log.
    - ***userId***: The id of the user that made the request, if not given the userId will be set to unknown.
    - ***OPTIONNAL***: Any other data to log.

  If the post is successful, the service will return a json object with the following fields:
  - ***status***: The status of the request (success, error).
  - ***message***: The success message from the CouchDB.

- **GET /logger/user/info/:username**: Get all the info logs of the user with the given username. The service will return a json object with the following fields:
  :heavy_exclamation_mark: To get the logs of a user you must be an admin or user of the requested data and provide a valid token in the header of the request.
  - ***status***: The status of the request (success, error).
  - ***data***: An array of json objects containing the logs of the user previously sent.

In case of error, the service will return a json object with the following fields:
- ***message***: The error message.
- ***status***: The status of the request (success, error).

## Gateway service

### Role of the service

The gateway service is used to redirect the requests made by the user to the corresponding microservice. 

### Associated technologies

This service use different technologies to provide an authentification but mainly:
- **Nginx**: A web server to redirect the requests to the corresponding microservice.
- **Docker**: To distribute in a round robin fashion the requests to the different instances of the microservices.

### How to build the container

To build the container for the gateway service, run the following command in
the project directory:

:heavy_exclamation_mark: If you do not have the your docker id exported in a `DOCKER_ID` variable in your environment, you can either export it or uncomment the `DOCKER_ID` variable

```bash
# To build and push to docker hub the entire gateway service
make gateway

# To only build the gateway container
make gateway-build

# To only push the gateway container to docker hub
make gateway-push
```

# Swarm

## How to run a swarm of instances

To run the user service you can use the following command but it will run the entire swarm
of containers:

```bash
# To run the entire swarm of containers or reload (removing old swarm)
make swarm-deploy
make swarm-reload

# To run the entire swarm of containers with elastic scaling or reload (removing old swarm)
make swarm-deploy-with-elastic
make swarm-reload-with-elastic

```
