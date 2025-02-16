# E-commerce App

## Project Overview

A cloud-native e-commerce application built with microservices architecture, featuring scalable components and asynchronous logging.

The app is deployed on Microsoft Azure cloud infrastructure, using virtual machines.

## Architecture

### Frontend

- Built with Svelte and Tailwind CSS
- Containerized using Docker
- Responsive web interface for e-commerce operations

### Backend Services

- **Gateway**: API Gateway service for routing requests (Nginx)
- **Users**: Authentication and user role management
- **Products**: Product catalog management
- **Orders**: Order processing and management
- **Shopping Carts**: Cart management service
- **Recommendations**: Product recommendation engine
- **Logger**: Asynchronous logging service
- **Storage**: Azure Blob Storage service for images and CouchDB for product and user data

## Scalability Features

- Docker Swarm orchestration
- Elastic scaling capabilities
- Artillery load testing integration
- Auto-scaling scripts for dynamic workloads
