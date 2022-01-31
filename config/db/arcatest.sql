

-- arcatest db schema
CREATE ROLE "www-data";
ALTER ROLE "www-data" WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN NOREPLICATION NOBYPASSRLS;
CREATE ROLE "postgres";
ALTER ROLE "postgres" WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN NOREPLICATION NOBYPASSRLS;


DROP SEQUENCE IF EXISTS scustomer;
CREATE SEQUENCE scustomer start 1000;
DROP TABLE IF EXISTS customer;
CREATE TABLE customer(
  custid INT DEFAULT nextval('scustomer') NOT NULL,
  email TEXT,
  fname TEXT,
  lname TEXT,
  gender TEXT,
  created TIMESTAMP,
  updated TIMESTAMP,
  PRIMARY KEY(custid)
);
CREATE INDEX icustomer1 ON customer (custid);
CREATE UNIQUE INDEX icustomer2 ON customer USING btree (email);
GRANT ALL ON TABLE customer, scustomer TO PUBLIC;


DROP SEQUENCE IF EXISTS slist;
CREATE SEQUENCE slist start 1000;
DROP TABLE IF EXISTS list;
CREATE TABLE list(
  listid INT DEFAULT nextval('slist') NOT NULL,
  code TEXT,
  title TEXT,
  description TEXT,
  -- circulation INT DEFAULT 0,
  leadcost NUMERIC(8,4)
);
CREATE INDEX ilist1 ON list (listid);
CREATE UNIQUE INDEX ilist2 ON list USING btree (code);
GRANT ALL ON TABLE list, slist TO PUBLIC;



DROP TABLE IF EXISTS custlist;
CREATE TABLE IF NOT EXISTS custlist(
  custid INT,
  listid INT,
  subscribed_on TIMESTAMP,
  CONSTRAINT fk_customer 
      FOREIGN KEY(custid) 
          REFERENCES customer(custid)
          ON DELETE CASCADE
);
CREATE UNIQUE INDEX icustlist1 ON custlist USING btree (custid,listid);
CREATE INDEX icustlist2 ON custlist (listid);
GRANT ALL ON TABLE custlist TO PUBLIC;



--- populate list data

INSERT INTO list (code,title,description,leadcost) 
VALUES ('automotivenews',   'Automotive News',      'The latest topics on cars and horsepower!', '0.20'),
       ('businessnews',     'Business News',        'Trending business topics from around the globe', '0.20'),
       ('comics',           'Comics',               'The funnies page gone digital!', '0.20'),
       ('entertainment',    'Entertainment News',   'Get the latest on celebrities and gossip!', '0.20'),
       ('horoscopes',       'Astrology',            'Your daily horoscope and astrology news', '0.20'),
       ('fashiondaily',     'Fashion Daily',        'Hot trends in fashion, tips and more', '0.20'),
       ('healthandfitness', 'Health and Fitness',    'The latest heath topics, trends and advice columns', '0.20'),
       ('sports',           'Sports',               'The latest sports topics and highlights', '0.20'),
       ('food',             'Food Culture',         'Find the best restaurants, recipes and food around the world', '0.20'),
       ('offers',           'Daily Offers',         'Get the best deals of the day!', '0.20');

