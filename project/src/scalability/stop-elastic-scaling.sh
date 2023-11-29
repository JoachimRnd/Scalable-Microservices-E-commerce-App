#!/bin/bash

SERVICES=("scapp_users-daemon" "scapp_orders-daemon" "scapp_shopping-carts-daemon" "scapp_products-daemon")

for service in "${SERVICES[@]}"; do
  if [ -f "pids/${service}_pid.txt" ]; then
    pid=$(cat "pids/${service}_pid.txt")
    echo "Killing the background process for service ${service} with PID ${pid}"
    kill $pid
    rm "pids/${service}_pid.txt"
    rm "logs/${service}.log"
  else
    echo "Elastic scaling : No PID file found for service ${service}"
  fi
done
