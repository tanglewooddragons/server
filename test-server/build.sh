#!/usr/bin/env bash

docker rm -f test-server

docker rmi test-server

docker image prune

docker volume prune

docker build -t test-server .