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

# To only bulild the frontend container
make frontend-build

# To only push the frontend container to docker hub
make frontend-push
```
To run the frontend you can use the following command but it will run the entire swarm
of containers:

```bash
make swarm-deploy
```

### How to run a swarm of instances of the container in a VM hosted in the cloud

### API of the service

<!--  -->


## User service

### Role of the service

### Associated technologies

### How to build the container

### How to run a swarm of instances of the container in a VM hosted in the cloud

### API of the service

<!--  -->

## Order service

### Role of the service

### Associated technologies

### How to build the container

### How to run a swarm of instances of the container in a VM hosted in the cloud

### API of the service

<!--  -->

## Shopping cart service

### Role of the service

### Associated technologies

### How to build the container

### How to run a swarm of instances of the container in a VM hosted in the cloud

### API of the service


<!--  -->

## Product service

### Role of the service

### Associated technologies

### How to build the container

### How to run a swarm of instances of the container in a VM hosted in the cloud

### API of the service


<!--  -->


## Gateway service

### Role of the service

### Associated technologies

### How to build the container

### How to run a swarm of instances of the container in a VM hosted in the cloud

### API of the service