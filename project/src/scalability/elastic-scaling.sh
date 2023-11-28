#!/bin/bash -
#===============================================================================
#
#          FILE: apply-policy-of-scalability.sh
#
#         USAGE: ./apply-policy-of-scalability.sh
#
#   DESCRIPTION: This script implements a simple policy of scalability within a docker
#     swarm: When the average CPU usage of all nodes in the swarm reaches a certain threshold,
#     we add more replicas.
#        AUTHOR: Raziel Carvajal-Gomez (), raziel.carvajal@uclouvain.be
#  ORGANIZATION:
#       CREATED: 10/29/2019 10:52
#      REVISION:  ---
#===============================================================================

#---  FUNCTION  ----------------------------------------------------------------
#          NAME:  endScript
#   DESCRIPTION:  Gives feedback about how to launch the current script.
#-------------------------------------------------------------------------------
function endScript {
  case ${1} in
    "notManager" )
      echo "Error: this node is not a swarm manager. Run this script in a \
        swarm manager."
      ;;
    "wrongArgs" )
      echo "Error: wrong number of arguments."
      echo "Usage: ${shName} <name-of-stack> <name-of-service-to-scale>"
      ;;
    "unknownStack" )
      echo "Error: the stack name you provide does not exist."
      ;;
    "unknownService" )
      echo "Error: the service name you provide does not exist."
      ;;
    * )
      ;;
  esac
  echo "End of ${0}"
  exit 1
}

WORKERS_IPS=""
#---  FUNCTION  ----------------------------------------------------------------
#          NAME:  getWorkersIps
#   DESCRIPTION:  List all workers in swarm.
#-------------------------------------------------------------------------------
function getWorkersIps {
  rm -f tmp nodes
  docker node ls | awk '{print $1, $2}' > tmp
  l=`wc -l tmp | awk '{print $1}'`
  let n=${l}-1
  # file "nodes" contains all nodes in the swarm
  workers=""
  tail -${n} tmp > nodes
  for (( i = 1; i <= ${n}; i++ )); do
    id=`head -${i} nodes | tail -1 | awk '{print $1}'`
    role=`head -${i} nodes | tail -1 | awk '{print $2}'`
    if [ "${role}" != "*" ]; then
      workers="${id} ${workers}"
    fi
  done
  # ${workers} is a string (sparated with spaces) with all workers IDs in a swarm
  for w in ${workers} ; do
    ip=`docker node inspect ${w} | grep Addr | awk '{print $2}'`
    WORKERS_IPS="${ip} ${WORKERS_IPS}"
  done
  # ${WORKERS_IPS} is a string (sparated with spaces) with all workers IP addresses in a swarm
  rm -f tmp nodes
}

#-------------------------------------------------------------------------------
# Verifies that the right number of arguments were passed and whether this script
# is launched in the swarm manager.
#-------------------------------------------------------------------------------
docker node ls &> /dev/null
[ ${?} != 0 ] && endScript "notManager"

getWorkersIps

AVG="0.0"
#service="${stack}_${2}"
#---  FUNCTION  ----------------------------------------------------------------
#          NAME:  updateAvg
#   DESCRIPTION:  Computes the average of CPU among nodes in the swarm.
#-------------------------------------------------------------------------------
function updateAvg {
  local service="$1"
  sum=""
  REPLICAS=0
  id=`docker ps | grep ${service}`
  if [ "${id}" != "" ] ; then
    id=`echo ${id} | awk '{print $1}'`
    data=`docker stats --no-stream ${id}`
    sum=`echo ${data} | awk '{print $19}' | awk -F '%' '{print $1}'`
    let REPLICAS=REPLICAS+1
  fi
  for ip in ${WORKERS_IPS} ; do
    ip=`echo ${ip} | awk -F '"' '{print $2}'`
    id=`ssh ${ip} "docker ps" | grep ${service}`
    if [ "${id}" != "" ] ; then
      id=`echo ${id} | awk '{print $1}'`
      data=`ssh ${ip} "docker stats --no-stream ${id}"`
      data=`echo ${data} | awk '{print $19}' | awk -F '%' '{print $1}'`
      sum="${data}, ${sum}"
      let REPLICAS=REPLICAS+1
    fi
  done
  #echo "Get avg with [${sum}]"
  ok=`python -c "l = [${sum}] ;r = 1 if len(l) != 0 else 0 ;print(r) "`
  if [ ${ok} -eq 1 ]; then
    AVG=`python -c "l = [${sum}] ;print( sum(l) / len(l) ) "`
  else
    AVG="0.0"
  fi
  #echo "AVG = ${AVG}"
}

TRESHOLD="80.0"
PATIENCE_COUNT=5  # Nombre d'itérations où ${AVG} < ${TRESHOLD} === 1
PATIENCE=0
#---  FUNCTION  ----------------------------------------------------------------
#          NAME:  tresholdNotReached
#   DESCRIPTION:  Prints 1 if the CPU threshold was reached or 0 otherwise.
#-------------------------------------------------------------------------------
function tresholdNotReached {
  echo $(python -c "r = 1 if ${AVG} < ${TRESHOLD} else 0 ;print(r)")
}

SERVICE=$1
WORKERS=1

while true; do
  while [ "$(tresholdNotReached)" == "1" ]; do
    updateAvg "${SERVICE}"
    ((PATIENCE++))
    #echo "Service : ${SERVICE}"
    if [ ${PATIENCE} -ge ${PATIENCE_COUNT} ] && [ ${WORKERS} -gt 1 ]; then
      let "WORKERS=WORKERS/3"
      echo "Reducing for service ${SERVICE} to ${WORKERS} replicas."
      docker service scale ${SERVICE}=${WORKERS}
      PATIENCE=0
    fi
    sleep 5
  done
  PATIENCE=0
  AVG="0.0"
  let "WORKERS=WORKERS*3"
  echo "Scaling of: ${SERVICE} to ${WORKERS} replicas."
  docker service scale ${SERVICE}=${WORKERS}
done
  