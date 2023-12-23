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
  echo "Checking if the DB (${DB_NAME}) exists..."
  DB_CHECK=$(curl --silent --request GET ${DB_URL})

  echo "db chekc: ${DB_CHECK}"

  if [ -z "$DB_CHECK" ] || [[ "$DB_CHECK" == *"error"* ]]; then
    echo "Wait (indefinitely) until the DB creation (name: ${DB_NAME})."
    echo "The DB URL is: ${DB_URL}"
    until curl --request PUT ${DB_URL} ; do
      echo -e "\t DB (${DB_NAME}) wasn't created - trying again later..."
      sleep 2
    done

    echo "DB (${DB_NAME}) was created!"

    echo "Running db-init.js..."  
    node db-init.js
  else
    echo "DB (${DB_NAME}) already exists!"
  fi 
fi

echo "Apply a formatter for each view"
mkdir formatter_output
DEBUG=views* node func_to_string.js
if [[ ${?} != 0 ]]; then
  echo -e "ERROR: during the creation of views\nEND OF ${0}"
  exit 1
fi
echo -e "\tDONE"

echo "Creation of views for products DB"
for view in `ls ./formatter_output/*.js`; do
  echo -e "\t${view}"
  cat ${view} 
  curl -X PUT "${DB_URL}/_design/products" --upload-file ${view}
  if [[ ${?} != 0 ]]; then
    echo -e "ERROR: during the creation of view ${view}\nEND OF ${0}"
    exit 1
  fi
done
echo -e "\tDONE"

echo "Start users service..."
npm start
