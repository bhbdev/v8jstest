#!/bin/bash

# this is for backend dev!
# use refresh.sh instead to manage service builds/restarts

# make v8jstest rebuild on jsnews container
docker exec -ti arcamax_jsnews sh -c "cd $AMIDIR/src && make deps && make -j8 justv8jstest" 
# copy binary to bin
docker cp arcamax_jsnews:/home/arcamax/bin/v8jstest bin/
#restart, wipe volumn, rebuild and restart services
docker compose down
docker volume rm v8jstest_pg-data
docker compose up --build --remove-orphans -d
