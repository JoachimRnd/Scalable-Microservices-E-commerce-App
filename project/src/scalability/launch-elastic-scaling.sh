#!/bin/bash

SERVICES=("scapp_users-daemon" "scapp_orders-daemon" "scapp_shopping-carts-daemon" "scapp_products-daemon")

for service in "${SERVICES[@]}"; do
  (
    ./src/scalability/elastic-scaling.sh "${service}"> "logs/${service}.log" 2>&1 &
    pid=$!
    echo "${pid}" > "pids/${service}_pid.txt"
  )
done

echo "${0} is running in background"
