require('dotenv').config();
const mariadb = require('mariadb');

// Create a connection pool
const pool = mariadb.createPool({
  host: process.env.DB_HOST, // Remote MariaDB host
  user: process.env.DB_USER, // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name
  port: process.env.DB_PORT, // Add port
  connectionLimit: 10, // Increase pool size
  acquireTimeout: 30000, // Increase timeout to 30 seconds
  ssl: false, // Disable SSL
});

module.exports = pool;
