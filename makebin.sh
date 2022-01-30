#!/bin/bash

docker exec -ti arcamax_jsnews sh -c "cd $AMIDIR/src && make deps && make -j8 justv8jstest" 
docker cp arcamax_jsnews:/home/arcamax/bin/v8jstest bin/
#restart
docker compose down
docker volume rm v8jstest_pg-data
docker compose up --build --remove-orphans -d
