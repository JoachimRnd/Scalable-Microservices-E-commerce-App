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

export DB_URL="http://${ADMIN_NAME}:${ADMIN_PASSW}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

if [ "${WITH_PERSISTENT_DATA}" != "" ]; then

  echo "Wait (indefenitly) until the DB creation (name: ${DB_NAME})."
  echo "The DB URL is: ${DB_URL}"
  until curl --request PUT ${DB_URL} ; do
    echo -e "\t DB (${DB_NAME}) wasn't created - trying again later..."
    sleep 2
  done
  echo "DB (${DB_NAME}) was created!"

  echo "Creating admin user..."
  curl --request PUT ${DB_URL}/admin \
      -d '{
          "_id": "admin",
          "passw": "$2a$10$.R6nexERN6xtXMltIwjxM.n0Ea5pKtQwI0ddbeNbKWJ2msRynZH/u",
          "role": "admin"
      }'

fi
echo "Start users service..."
npm start