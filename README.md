# v8jstest

---
## Project
This project provides a sample environment for developers to practice code exercises.


## Requirements

Developer must have [docker-compose](https://docs.docker.com/compose/install/) installed.

## Setup:

Clone the repo

```
git clone git@github.com:bhbdev/v8jstest.git v8jstest && cd v8jstest
```


To start up the project services (db,api,web) run this command in your terminal:

```
docker-compose up -d
```

To stop the services:

```
docker-compose down
```

---

#### Notes

 - The __api__ service can be located at ```http://localhost:4100```
 - The __web__ service can be located at ```http://localhost:4200```
 - The __db__ service runs on port ```5438```


---
#### API endpoints

The __api__ service app has the following endpoints setup to fetch and send data. Responses are in JSON format.


___/getlists___ - returns all lists in the database

 ``` curl -Lv http://localhost:4100/getlists ```


___/getcusts___ - returns all customers in the database

 ``` curl -Lv http://localhost:4100/getcusts ```


___/getcust___  - This endpoint returns a customer by email


``` curl -Lv http://localhost:4100/getcust?email=bob@example.com ```

_Accepted parameters:_ __email__



___/subscribe___ - creates or updates new customers, subscribes or unsubscribes customers to a list.

_Accepted parameters:_ 

 - __email__
 - __fname__
 - __lname__
 - __gender__ 
 - __lists__   _list id or comma-delimted list of listids_
 - __unsubs__  _list id or comma-delimted list of listids_
 
