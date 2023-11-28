#!/bin/bash

SERVICES=("scapp_users_daemon") #"scapp_orders_daemon" "scapp_shopping-carts-daemon" "scapp_products_daemon")

for service in "${SERVICES[@]}"; do
  if [ -f "${service}_pid.txt" ]; then
    pid=$(cat "${service}_pid.txt")
    echo "Killing the background process for service ${service} with PID ${pid}"
    kill $pid
    rm "${service}_pid.txt"
  else
    echo "No PID file found for service ${service}"
  fi
done
