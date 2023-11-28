#!/bin/bash

SERVICES=("scapp_users-daemon" "scapp_orders-daemon" "scapp_shopping-carts-daemon" "scapp_products-daemon")

for service in "${SERVICES[@]}"; do
  (
    ./src/scalability/elastic-scaling.sh "${service}" &
    pid=$!
    echo "${pid}" > "${service}_pid.txt"
  )
done

echo "${0} is running in background"
