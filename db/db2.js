const { Pool, Client } = require('pg');
const {user, host, database , password, port} = require('../secrets/db_conf_old');
const pool = new Pool({user , host, database, password, port });
const client = new Client({user , host, database, password, port });

module.exports = { pool, client };
