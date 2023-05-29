#!/bin/bash

# build the node container
docker build -t penkov/server .

# create the network
docker network create gameserver

# start the mysql container
docker run --name mysql01 -e MYSQL_ROOT_PASSWORD=12345 --network=gameserver -d mysql

# start the server container
docker run -it --name myserver --network=gameserver -p 5000:5000 -d penkov/server

docker start mysql01
docker start myserver