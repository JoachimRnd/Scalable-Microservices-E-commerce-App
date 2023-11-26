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
backend-build: users-storage-build orders-storage-build shopping-carts-storage-build orders-build auth-build shopping-carts-build gateway-build
backend-push: users-storage-push orders-storage-push shopping-carts-storage-push orders-push auth-push shopping-carts-push gateway-push  
swarm-reload: swarm-remove swarm-deploy

# Docker tasks
frontend: frontend-build frontend-push
backend: backend-build backend-push
storage: users-storage-build users-storage-push orders-storage-build orders-storage-push shopping-carts-storage-build shopping-carts-storage-push
auth: auth-build auth-push
gateway: gateway-build gateway-push
orders: orders-build orders-push
shopping-carts: shopping-carts-build shopping-carts-push
                                                                                                                                                                                                               
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

orders-storage-build:
	@echo -e "${GREEN}Buidling orders storage docker image...${NC}"
	@docker build -t orders-storage-system src/back-end/storage

orders-storage-push:
	@docker tag orders-storage-system ${DOCKER_ID}/orders-storage-system
	@docker push ${DOCKER_ID}/orders-storage-system

shopping-carts-storage-build:
	@echo -e "${GREEN}Buidling shopping-carts storage docker image...${NC}"
	@docker build -t shopping-carts-storage-system src/back-end/storage

shopping-carts-storage-push:
	@docker tag shopping-carts-storage-system ${DOCKER_ID}/shopping-carts-storage-system
	@docker push ${DOCKER_ID}/shopping-carts-storage-system

auth-build:
	@echo -e "${GREEN}Buidling auth docker image...${NC}"
	@docker build -t scapp-auth src/back-end/users

auth-push:
	@docker tag scapp-auth ${DOCKER_ID}/scapp-auth
	@docker push ${DOCKER_ID}/scapp-auth

orders-build:
	@echo -e "${GREEN}Buidling orders docker image...${NC}"
	@docker build -t scapp-orders src/back-end/orders

orders-push:
	@docker tag scapp-orders ${DOCKER_ID}/scapp-orders
	@docker push ${DOCKER_ID}/scapp-orders	

shopping-carts-build:
	@echo -e "${GREEN}Buidling shopping-carts docker image...${NC}"
	@docker build -t scapp-shopping-carts src/back-end/shoppingCarts

shopping-carts-push:
	@docker tag scapp-shopping-carts ${DOCKER_ID}/scapp-shopping-carts
	@docker push ${DOCKER_ID}/scapp-shopping-carts	

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

reload: full swarm-reload
	@echo -e "${GREEN}Reloading stack...${NC}"