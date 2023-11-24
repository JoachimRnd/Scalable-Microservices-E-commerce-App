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
backend-build: storage-build  auth-build
backend-push: storage-push auth-push   
swarm-reload: swarm-remove swarm-deploy

# Docker tasks
frontend: frontend-build frontend-push
storage: storage-build storage-push
auth: auth-build auth-push
gateway: gateway-build gateway-push
                                                                                                                                                                                                               
# Small tasks   
frontend-build:
	@echo -e "${GREEN}Buidling frontend docker image...${NC}"
	@docker build -t scapp-frontend src/front-end
	
frontend-push:
	@docker tag scapp-frontend ${DOCKER_ID}/scapp-frontend
	@docker push ${DOCKER_ID}/scapp-frontend

storage-build:
	@echo -e "${GREEN}Buidling storage docker image...${NC}"
	@docker build -t kv-storage-system src/back-end/storage

storage-push:
	@docker tag kv-storage-system ${DOCKER_ID}/kv-storage-system
	@docker push ${DOCKER_ID}/kv-storage-system

auth-build:
	@echo -e "${GREEN}Buidling auth docker image...${NC}"
	@docker build -t scapp-auth src/back-end/users

auth-push:
	@docker tag scapp-auth ${DOCKER_ID}/scapp-auth
	@docker push ${DOCKER_ID}/scapp-auth

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
	@
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


reload: frontend storage auth gateway swarm-reload
	@echo -e "${GREEN}Reloading stack...${NC}"