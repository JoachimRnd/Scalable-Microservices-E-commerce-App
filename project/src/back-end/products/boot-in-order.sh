#!/bin/bash -
#===============================================================================
#
#          FILE: boot-in-order.sh
#
#         USAGE: ./boot-in-order.sh
#
#   DESCRIPTION:
#     Waits until the daemon of CouchDB starts to create a database. The
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
export LOGGING_DB_URL="http://${ADMIN_NAME}:${ADMIN_PASSW}@${LOGGING_DB_HOST}:${DB_PORT}/${DEBUG}"

if [ "${WITH_PERSISTENT_DATA}" != "" ]; then
  echo "Wait (indefinitely) until the DB creation (name: ${DB_NAME})."
  echo "The DB URL is: ${DB_URL}"
  until curl --request PUT ${DB_URL} ; do
    echo -e "\t DB (${DB_NAME}) wasn't created - trying again later..."
    sleep 2
  done

  echo "Inserting views into the database..."

  curl --request PUT \
  --url ${DB_URL}/_design/products \
  --header 'Content-Type: application/json' \
  --data '{
    "views": {
      "getProducts": {
        "map": "function (doc) { emit(doc._id, doc); }"
      },
      "getProductsByIds": {
        "map": "function (doc) { if (doc._id) { emit(doc._id, doc); } }"
      }
    }
  }'

  echo "DB (${DB_NAME}) was created!"

  echo "Running db-init.js..."
  node db-init.js
fi

echo "Start users service..."
npm start
