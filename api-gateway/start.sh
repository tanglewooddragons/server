#!/usr/bin/env bash

eval `docker-machine env manager1`

docker rm -f api-gateway
docker rmi api-gateway
docker image prune
docker volume prune
docker build -t api-gateway .
docker run --name api-gateway -v /home/yoshuro/.docker/machine/machines/manager1:/certs api-gateway
