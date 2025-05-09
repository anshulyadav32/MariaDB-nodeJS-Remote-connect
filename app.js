require('dotenv').config();
const mariadb = require('mariadb');
const express = require('express');
const app = express();
const port = 3000;

// Create a connection pool
const pool = mariadb.createPool({
  host: process.env.DB_HOST, // Remote MariaDB host
  user: process.env.DB_USER, // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name
  connectionLimit: 5, // Connection pool limit
  ssl: false, // Disable SSL
});

// Endpoint to check database connection
app.get('/connection-status', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query('SELECT 1 as val');
    res.json({ success: true, message: 'Connected to the database successfully!' });
  } catch (err) {
    res.json({ success: false, error: err.message });
  } finally {
    if (conn) conn.end();
  }
});

// Serve static files
app.use(express.static(__dirname));

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
