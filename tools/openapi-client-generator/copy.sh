#!/bin/bash
OPENAPI_CONTAINER_NAME=$(docker ps -aqf "name=openapi_generator")
rm -rf ../../common/src/clients/*
docker cp ${OPENAPI_CONTAINER_NAME}:/local/out/. ../../common/src/clients
cd ../../common/clients && yarn run prettier && yarn run lint