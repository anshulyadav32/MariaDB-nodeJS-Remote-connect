# MariaDB-nodeJS-Remote-connect

This repository contains code and resources for connecting to a remote MariaDB database using Node.js.

## Features
- Connect to a remote MariaDB database.
- Display database connection status dynamically on the web page.
- Fetch and display all tables in the database.

## Endpoints
- `/connection-status`: Checks the database connection status.
- `/tables`: Fetches and returns all tables in the database.

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   nodemon app.js
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000/index.html
   ```

## Configuration
- Update the `.env` file with your database credentials:
   ```properties
   DB_HOST=your-database-host
   DB_PORT=3306
   DB_USER=your-database-username
   DB_PASSWORD=your-database-password
   DB_NAME=your-database-name
   ```