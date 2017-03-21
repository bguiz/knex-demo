
## pre-reqs

Install Postgres 9.6


## set up

Set up database:

```bash
psql
```

```sql
-- user role api:api
-- DROP ROLE api;
CREATE ROLE api
	LOGIN ENCRYPTED PASSWORD 'api'
	VALID UNTIL 'infinity';

-- database api
-- DROP DATABASE api;
CREATE DATABASE api
	WITH ENCODING='UTF8'
	OWNER=api
	CONNECTION LIMIT=-1;

-- list all roles
-- verify there is api role and passwd begins with `md5` followed by a hash
select * from pg_catalog.pg_shadow;

-- list all databases
-- verify that there is an entry for database api with owner api
\list

\q
```

Expected output of the last two commands (cropped):

```bash
usename     | usesysid | usecreatedb | usesuper | userepl | usebypassrls |               passwd                | valuntil | useconfig
----------------+----------+-------------+----------+---------+--------------+-------------------------------------+----------+-----------
api            |    25289 | f           | f        | f       | f            | md56da13b696f737097e0146e47cc0d0985 | infinity |
```

```bash
Name      |     Owner      | Encoding |   Collate   |    Ctype    |        Access privileges        
----------------+----------------+----------+-------------+-------------+---------------------------------
api            | api            | UTF8     | en_GB.UTF-8 | en_GB.UTF-8 |
```

## migrate all databases

```bash
yarn erun -- database-migrate-latest localhost
```
