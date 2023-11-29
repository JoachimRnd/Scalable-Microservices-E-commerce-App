# Scalable application

This project uses Docker containers and a Makefile to simplify the build process and ensure consistency across different environments. The different services are described in the [Services.md](./Services.md) file.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

:heavy_exclamation_mark: **Note:** If you are using Windows the .sh files are written in LF and not CRLF. You can change the line endings in VSCode by clicking on the CRLF in the bottom right corner and selecting LF. 

### Prerequisites

- Docker
- GNU Make

### Building the Images

To build all the docker images in the project, run the following command:

:heavy_exclamation_mark: **Important:** Before building the docker images you need to find the IP of the manager node and change two files:
- [scapp.yml](./scapp.yml) `line 65` - change the `PUBLIC_AUTH_SERVICE_URL` to the IP of the manager node
- [nginx.conf](./back-end/gateway/nginx.conf)  - change the `192.168.56.101` to the IP of the manager node for all occurrences of `192.168.56.101`.

```bash
make full-build

# or
make backend-build
make frontend-build
```

For more information about the services and how to build them, please refer to the [Services.md](./Services.md).

## The Swarm

### Creating the swarm

To initiate the swarm, run the following command:

```bash
# Deploying the swarm without scaling
make swarm-init
```

### Running the swarm

To run the swarm, run the following command:

```bash
# Deploying the swarm without scaling
make swarm-deploy

# Deploying the swarm with scaling
make swarm-deploy-with-scaling

# Reloading the swarm
make swarm-reload
make swarm-reload-with-scaling
```

### Stopping the swarm

To stop the swarm, run the following command:

```bash
# Stopping the swarm and the scaling services (if any)
make swarm-remove
```

### Leaving the swarm

To leave the swarm, run the following command:

```bash
# Leaving the swarm
make swarm-leave
```


## Scalability

The scalability is achieved by having different processes that monitors the CPU usage of the different services and scales the processess accordingly. The service is replicated 3 times when the demand is high and is scaled down when the demand is low.

### Testing the scalability

To test the scalability, run the following command:

```bash
# Testing the scalability of the auth service
make elastic-scaling-users-daemon-test

# Testing the scalability of the orders service
make elastic-scaling-orders-daemon-test

# Testing the scalability of the products service
make elastic-scaling-products-daemon-test

# Testing the scalability of the shopping cart service
make elastic-scaling-shopping-carts-daemon-test
```

:heavy_exclamation_mark: **Important:** Before testing you need to have started the scalability processes. To do so, run the following command:

```bash
make swarm-deploy-with-scaling

# or
make launch-elastic-scaling
make scaling-reload

# For stopping the scaling processes
make stop-elastic-scaling

```
