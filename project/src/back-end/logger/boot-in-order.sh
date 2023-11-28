#!/bin/bash -
#===============================================================================
#
#          FILE: boot-in-order.sh
#
#         USAGE: ./boot-in-order.sh
#
#   DESCRIPTION:
#     Waits until the deamon of CouchDB starts to create a database. The
#     environment variable DB_URL contains more details of such DB
#     (name, authentication information of administrator, etc).
#       OPTIONS: ---
#  REQUIREMENTS: This script makes use of the environment variables DB_NAME and
#     DB_URL, be sure that such variables were defined before running this script.
#          BUGS: ---
#         NOTES: ---
#        AUTHOR: Raziel Carvajal-Gomez (), raziel.carvajal@uclouvain.be
#  ORGANIZATION:
#       CREATED: 10/08/2018 09:20
#      REVISION:  ---
#===============================================================================

export DB_URL="http://${ADMIN_NAME}:${ADMIN_PASSW}@${DB_HOST}:${DB_PORT}"

echo "Wait (indefenitly) until the DB creation (name: users-d-logs)."
echo "The DB URL is: ${DB_URL}"
until curl --request PUT ${DB_URL}/users-d-logs ; do
  echo -e "\t DB (users-d-logs) wasn't created - trying again later..."
  sleep 2
done
echo "DB (users-d-logs) was created!"

echo "Wait (indefenitly) until the DB creation (name: orders-d-logs)."
echo "The DB URL is: ${DB_URL}"
until curl --request PUT ${DB_URL}/orders-d-logs ; do
  echo -e "\t DB (orders-d-logs) wasn't created - trying again later..."
  sleep 2
done
echo "DB (orders-d-logs) was created!"

echo "Wait (indefenitly) until the DB creation (name: carts-d-logs)."
echo "The DB URL is: ${DB_URL}"
until curl --request PUT ${DB_URL}/carts-d-logs ; do
  echo -e "\t DB (carts-d-logs) wasn't created - trying again later..."
  sleep 2
done
echo "DB (carts-d-logs) was created!"

echo "Wait (indefenitly) until the DB creation (name: products-d-logs)."
echo "The DB URL is: ${DB_URL}"
until curl --request PUT ${DB_URL}/products-d-logs ; do
  echo -e "\t DB (products-d-logs) wasn't created - trying again later..."
  sleep 2
done
echo "DB (products-d-logs) was created!"

echo "Start users service..."
npm start