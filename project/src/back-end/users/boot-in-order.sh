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

  echo "Apply a formatter for each view"
  mkdir formatter_output
  DEBUG=views* node func_to_string.js
  if [[ ${?} != 0 ]]; then
    echo -e "ERROR: during the creation of views\nEND OF ${0}"
    exit 1
  fi
  echo -e "\tDONE"

  echo "Creation of views for users DB"
  for view in `ls ./formatter_output/*.js`; do
    echo -e "\t${view}"
    cat ${view} 
    curl -X PUT "${DB_URL}/_design/users" --upload-file ${view}
    if [[ ${?} != 0 ]]; then
      echo -e "ERROR: during the creation of view ${view}\nEND OF ${0}"
      exit 1
    fi
  done
  echo -e "\tDONE"

  echo "Creating admin user..."
  curl --request PUT ${DB_URL}/admin \
      -d '{
          "_id": "admin",
          "passw": "$2a$10$ZQMfyGXsTkYAvwSA.QcSS.Sob3TQlR2CaYmy86l15qzF9QTgm7oPy",
          "role": "admin"
      }'

fi
echo "Start users service..."
npm start