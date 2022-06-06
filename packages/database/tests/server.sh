#!/usr/bin/env bash

HOST=http://localhost:8080 
response=$(curl --write-out '%{http_code}' --silent --output /dev/null $HOST)
echo $response
