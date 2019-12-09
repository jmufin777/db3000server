#!/bin/bash
###help 
### npm init -y
#### npm i nodemon --save-dev
exit
export PGPASSWORD='db3000'
database="db3000"
echo "Configure database: $database"
dropdb -U db3000 db3000
createdb -U db3000 db3000

psql -U db3000 $database < ./bin/sql/db3000.sql

echo "$database configured"