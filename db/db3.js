const { Pool, Client } = require('pg');
const {user, host, database , password, port} = require('../secrets/db_conf_old');
const pool2 = new Pool({user , host, database, password, port });
const client2 = new Client({user , host, database, password, port });

module.exports = { pool2, client2 };
