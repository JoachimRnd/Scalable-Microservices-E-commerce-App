# Variables  
                                                                                                                                                                                                              
# Colors                                                                                                                                                                                                       
RED=\033[0;31m                                                                                                                                                                                                 
GREEN=\033[0;32m                                                                                                                                                                                               
BLUE=\033[0;34m                                                                                                                                                                                                
YELLOW=\033[0;33m                                                                                                                                                                                              
NC=\033[0m   

##############                                                                                                                                                                                                             
# Main tasks #
##############  
full: full-build full-push                                                                                                                                                                                               
full-build: frontend-build backend-build
full-push: frontend-push backend-push   
backend-build: storage-build orders-build auth-build shopping-carts-build products-build gateway-build logger-build recommendations-build
backend-push: storage-push orders-push auth-push shopping-carts-push products-push gateway-push logger-push recommendations-push
swarm-reload: swarm-remove swarm-deploy
scaling-reload: stop-elastic-scaling launch-elastic-scaling
swarm-reload-with-scaling: swarm-remove swarm-deploy-with-scaling

# Docker tasks
frontend: frontend-build frontend-push
backend: backend-build backend-push
storage: storage-build storage-push 
auth: auth-build auth-push
gateway: gateway-build gateway-push
orders: orders-build orders-push
products: products-build products-push
shopping-carts: shopping-carts-build shopping-carts-push
recommendations: recommendations-build recommendations-push
logger: logger-build logger-push

###############                                                                                                                                                                                                               
# Small tasks #
############### 
frontend-build:
	@echo -e "${GREEN}Buidling frontend docker image...${NC}"
	@docker build -t scapp-frontend src/front-end
	
frontend-push:
	@docker tag scapp-frontend ${DOCKER_ID}/scapp-frontend
	@docker push ${DOCKER_ID}/scapp-frontend

storage-build:
	@echo -e "${GREEN}Buidling storage docker image...${NC}"
	@docker build -t storage-system src/back-end/storage

storage-push:
	@docker tag storage-system ${DOCKER_ID}/storage-system
	@docker push ${DOCKER_ID}/storage-system

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

products-build:
	@echo -e "${GREEN}Buidling products docker image...${NC}"
	@docker build -t scapp-products src/back-end/products

products-push:
	@docker tag scapp-products ${DOCKER_ID}/scapp-products
	@docker push ${DOCKER_ID}/scapp-products

recommendations-build:
	@echo -e "${GREEN}Buidling recommendations docker image...${NC}"
	@docker build -t scapp-recommendations src/back-end/recommendations

recommendations-push:
	@docker tag scapp-recommendations ${DOCKER_ID}/scapp-recommendations
	@docker push ${DOCKER_ID}/scapp-recommendations

gateway-build:
	@echo -e "${GREEN}Buidling gateway docker image...${NC}"
	@docker build -t scapp-gateway src/back-end/gateway

gateway-push:
	@docker tag scapp-gateway ${DOCKER_ID}/scapp-gateway
	@docker push ${DOCKER_ID}/scapp-gateway

artillery-build:
	@echo -e "${GREEN}Buidling artillery docker image...${NC}"
	@docker build -t scapp-artillery src/scalability/artillery

launch-elastic-scaling:
	@echo -e "${GREEN}Launching elastic scaling${NC}"
	@./src/scalability/launch-elastic-scaling.sh

stop-elastic-scaling:
	@echo -e "${GREEN}Stopping elastic scaling${NC}"
	@./src/scalability/stop-elastic-scaling.sh
	
logger-build:
	@echo -e "${GREEN}Buidling logger docker image...${NC}"
	@docker build -t scapp-logger src/back-end/logger

logger-push:
	@docker tag scapp-logger ${DOCKER_ID}/scapp-logger
	@docker push ${DOCKER_ID}/scapp-logger

###############
# SWARM TASKS #
###############

swarm-deploy:
	@echo "${GREEN}Deploying stack to swarm...${NC}"
	@docker stack deploy --resolve-image always -c src/scapp.yml scapp

swarm-deploy-with-scaling: swarm-deploy scaling-reload

swarm-remove: stop-elastic-scaling
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
	@echo -e "${GREEN}Stack reloaded...${NC}"


#################
# SCALING TASKS #
#################
elastic-scaling-users-daemon-test: launch-elastic-scaling artillery-build
	@echo -e "${GREEN}Running users artillery test...${NC}"
	@docker run -d --name users-load-test-$$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 6 | head -n 1) --network scapp-net scapp-artillery ./entrypoints-users.sh

elastic-scaling-orders-daemon-test: launch-elastic-scaling artillery-build
	@echo -e "${GREEN}Running orders artillery test...${NC}"
	@docker run -d --name orders-load-test-$$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 6 | head -n 1) --network scapp-net scapp-artillery ./entrypoints-orders.sh

elastic-scaling-shopping-carts-daemon-test: launch-elastic-scaling artillery-build
	@echo -e "${GREEN}Running shopping-carts artillery test...${NC}"
	@docker run -d --name carts-load-test-$$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 6 | head -n 1) --network scapp-net scapp-artillery ./entrypoints-shopping-carts.sh	

elastic-scaling-products-daemon-test: launch-elastic-scaling artillery-build
	@echo -e "${GREEN}Running products artillery test...${NC}"
	@docker run -d --name products-load-test-$$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 6 | head -n 1) --network scapp-net scapp-artillery ./entrypoints-products.sh

elastic-scaling-recommendations-daemon-test: launch-elastic-scaling artillery-build
	@echo -e "${GREEN}Running recommendations artillery test...${NC}"
	@docker run -d --name recommendations-load-test-$$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 6 | head -n 1) --network scapp-net scapp-artillery ./entrypoints-recommendations.sh

# Force pull from docker hub
pull:
	@echo -e "${GREEN}Pulling images from docker hub...${NC}"
	@docker pull ${DOCKER_ID}/scapp-frontend:latest
	@docker pull ${DOCKER_ID}/storage-system
	@docker pull ${DOCKER_ID}/scapp-auth
	@docker pull ${DOCKER_ID}/scapp-orders
	@docker pull ${DOCKER_ID}/scapp-shopping-carts
	@docker pull ${DOCKER_ID}/scapp-products
	@docker pull ${DOCKER_ID}/scapp-recommendations
	@docker pull ${DOCKER_ID}/scapp-gateway
	@docker pull ${DOCKER_ID}/scapp-logger