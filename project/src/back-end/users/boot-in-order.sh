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
if [ "${WITH_PERSISTENT_DATA}" != "" ]; then

  export DB_URL="http://${ADMIN_NAME}:${ADMIN_PASSW}@${DB_HOST}:${DB_PORT}/${DB_NAME}"


  echo "Wait (indefenitly) until the DB creation (name: ${DB_NAME})."
  echo "The DB URL is: ${DB_URL}"
  until curl --request PUT ${DB_URL} ; do
    echo -e "\t DB (${DB_NAME}) wasn't created - trying again later..."
    sleep 2
  done
  echo "DB (${DB_NAME}) was created!"

  echo "Creating admin user..."
  curl --request POST ${DB_URL}/users \
       --url ${DB_URL}/_design/users \
      --header 'Content-Type: application/json' \
      --data '{
          "_id": "admin",
          "_rev": "1-dcd13cfc741d5b83a6b56362c919eefa",
          "passw": "$2a$10$Ww9VgZ0o.tf7fGkp2AyQuuyBtIFmYjuB/8SidowNz.U46cqSbpoKa",
          "role": "admin"
      }'

fi
echo "Start users service..."
npm start