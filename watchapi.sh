#!/bin/bash

CONTAINER="v8jstest_api"
LOG="/v8jstest/logs/v8jstest.log"

echo "watching $CONTAINER log......"
docker exec -ti $CONTAINER sh -c "tail -f $LOG"