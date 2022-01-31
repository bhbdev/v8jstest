#!/bin/bash

# shutdown, wipe volume, rebuild and restart
docker compose down
docker volume rm v8jstest_pg-data
docker compose up --build --remove-orphans -d
