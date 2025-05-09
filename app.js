const express = require('express');
const app = express();
const config = require('./config/dotenvconfig');
const pool = require('./config/dbconfig');

const port = config.PORT;

// Import routes from index.js
const indexRouter = require('./index');

// Use the index router
app.use('/', indexRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
