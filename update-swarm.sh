#!/usr/bin/env bash

docker stack rm tanglewood
docker-compose -f docker-compose-swarm.yml build
docker-compose -f docker-compose-swarm.yml push
docker stack deploy --compose-file docker-compose-swarm.yml tanglewood
