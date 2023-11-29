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
  - ***username***: The username of the user.
  - ***password***: The password of the user.

  If the user is created successfully, the service will return a json object with the following fields:
  - ***token***: The token for this user valid for 14 days.  

- **GET /user/:username/:password**: If the username and password are correct, the service will return a json object with the following fields:
  
<!--  -->

## Order service

### Role of the service

### Associated technologies

### How to build the container

### API of the service

<!--  -->

## Shopping cart service

### Role of the service

### Associated technologies

### How to build the container

### API of the service


<!--  -->

## Product service

### Role of the service

### Associated technologies

### How to build the container

### API of the service


<!--  -->


## Gateway service

### Role of the service

### Associated technologies

### How to build the container

### API of the service

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