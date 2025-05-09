const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: process.env.DB_HOST, // Remote MariaDB host
  user: process.env.DB_USER, // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name
  connectionLimit: 5, // Connection pool limit
  ssl: false, // Disable SSL
});

module.exports = pool;
