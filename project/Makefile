 # Variables                                                                                                                                                                                                    
                                                                                                                                                                                                              
# Colors                                                                                                                                                                                                       
RED=\033[0;31m                                                                                                                                                                                                 
GREEN=\033[0;32m                                                                                                                                                                                               
BLUE=\033[0;34m                                                                                                                                                                                                
YELLOW=\033[0;33m                                                                                                                                                                                              
NC=\033[0m                                                                                                                                                                                                     
                                                                                                                                                                                                               
# Main tasks    
full: full-build full-push                                                                                                                                                                                               
full-build: frontend-build backend-build
full-push: frontend-push backend-push   
backend-build: users-storage-build products-storage-build products-build auth-build
backend-push: users-storage-push products-storage-push products-push auth-push   

# Docker tasks
frontend: frontend-build frontend-push
storage: users-storage-build users-storage-push products-storage-build products-storage-push
auth: auth-build auth-push
gateway: gateway-build gateway-push
products: products-build products-push
                                                                                                                                                                                                               
# Small tasks   
frontend-build:
	@echo -e "${GREEN}Buidling frontend docker image...${NC}"
	@docker build -t scapp-frontend src/front-end
	
frontend-push:
	@docker tag scapp-frontend ${DOCKER_ID}/scapp-frontend
	@docker push ${DOCKER_ID}/scapp-frontend

users-storage-build:
	@echo -e "${GREEN}Buidling users storage docker image...${NC}"
	@docker build -t users-storage-system src/back-end/storage

users-storage-push:
	@docker tag users-storage-system ${DOCKER_ID}/users-storage-system
	@docker push ${DOCKER_ID}/users-storage-system

products-storage-build:
	@echo -e "${GREEN}Buidling products storage docker image...${NC}"
	@docker build -t products-storage-system src/back-end/storage

products-storage-push:
	@docker tag products-storage-system ${DOCKER_ID}/products-storage-system
	@docker push ${DOCKER_ID}/products-storage-system

auth-build:
	@echo -e "${GREEN}Buidling auth docker image...${NC}"
	@docker build -t scapp-auth src/back-end/users

auth-push:
	@docker tag scapp-auth ${DOCKER_ID}/scapp-auth
	@docker push ${DOCKER_ID}/scapp-auth

products-build:
	@echo -e "${GREEN}Buidling products docker image...${NC}"
	@docker build -t scapp-products src/back-end/products

products-push:
	@docker tag scapp-products ${DOCKER_ID}/scapp-products
	@docker push ${DOCKER_ID}/scapp-products	

gateway-build:
	@echo -e "${GREEN}Buidling gateway docker image...${NC}"
	@docker build -t scapp-gateway src/back-end/gateway

gateway-push:
	@docker tag scapp-gateway ${DOCKER_ID}/scapp-gateway
	@docker push ${DOCKER_ID}/scapp-gateway

###############
# SWARM TASKS #
###############

swarm-deploy:
	@echo "${GREEN}Deploying stack to swarm...${NC}"
	@docker stack deploy -c src/scapp.yml scapp

swarm-remove:
	@echo -e "${GREEN}Removing stack from swarm...${NC}"
	@docker stack rm scapp

swarm-list:
	@echo -e "${GREEN}Listing scapp services from swarm...${NC}"
	@docker stack services scapp

swarm-leave:
	@echo -e "${GREEN}Leaving swarm...${NC}"
	@docker swarm leave --force

swarm-init:
	@echo -e "${GREEN}Swarm initiation...${NC}"
	@docker swarm init --advertise-addr 192.168.56.101
	@docker network create --driver overlay --attachable scapp-net

reload: frontend-build frontend-push storage auth products swarm-deploy
	@echo -e "${GREEN}Reloading stack...${NC}"