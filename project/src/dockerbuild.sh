echo "Buidling frontend docker image"
echo "================================"

cd front-end
docker build -t scapp-frontend .

if [ $? -eq 0 ]; then
    echo "Successfully build front image"
fi
docker tag scapp-frontend ${DOCKER_ID}/scapp-frontend
docker push ${DOCKER_ID}/scapp-frontend
cd ..

echo "Buidling backend docker image"
echo "================================"

cd back-end

echo "Building backend user-storage image"
echo "================================"

cd storage
docker build -t kv-storage-system .

if [ $? -eq 0 ]; then
    echo "Successfully build storage image"
fi
docker tag kv-storage-system ${DOCKER_ID}/kv-storage-system
docker push ${DOCKER_ID}/kv-storage-system
cd ..

echo "Building backend auth service image"
echo "================================"

cd users

docker build -t scapp-auth .

if [ $? -eq 0 ]; then
    echo "Successfully build auth image"
fi
docker tag scapp-auth ${DOCKER_ID}/scapp-auth
docker push ${DOCKER_ID}/scapp-auth
cd ..

