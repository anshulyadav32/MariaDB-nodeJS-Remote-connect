// Server-side code for handling database connection status
const express = require('express');
const router = express.Router();
const pool = require('./config/dbconfig');

// Endpoint to fetch all tables in the database
router.get('/tables', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const tables = await conn.query('SHOW TABLES');
    res.json({ success: true, tables: tables });
  } catch (err) {
    res.json({ success: false, error: err.message });
  } finally {
    if (conn) conn.end();
  }
});

// Endpoint to check database connection
router.get('/connection-status', async (req, res) => {
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

// Serve the connection status page
router.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Database Connection Status</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                margin-top: 50px;
            }
            .status {
                font-size: 1.5em;
                color: green;
            }
            .error {
                color: red;
            }
        </style>
    </head>
    <body>
        <h1>MariaDB Connection Status</h1>
        <div id="connection-status" class="status">Checking connection...</div>
        
        <div style="margin-top: 30px;">
            <h2>Database Tables</h2>
            <div id="tables-container">Loading tables...</div>
        </div>

        <!-- JavaScript to fetch and display connection status -->
        <script>
            // Fetch connection status
            fetch('/connection-status')
                .then(response => response.json())
                .then(data => {
                    const statusDiv = document.getElementById('connection-status');
                    if (data.success) {
                        statusDiv.textContent = 'Connected to the database successfully!';
                        // If connected successfully, fetch tables
                        fetchTables();
                    } else {
                        statusDiv.textContent = 'Failed to connect to the database: ' + data.error;
                        statusDiv.classList.add('error');
                        document.getElementById('tables-container').textContent = 'Cannot fetch tables: Database connection failed';
                        document.getElementById('tables-container').classList.add('error');
                    }
                })
                .catch(err => {
                    const statusDiv = document.getElementById('connection-status');
                    statusDiv.textContent = 'Error fetching connection status: ' + err.message;
                    statusDiv.classList.add('error');
                });
                
            // Function to fetch and display tables
            function fetchTables() {
                fetch('/tables')
                    .then(response => response.json())
                    .then(data => {
                        const tablesContainer = document.getElementById('tables-container');
                        if (data.success && data.tables.length > 0) {
                            // Create a table to display the database tables
                            const tableElement = document.createElement('table');
                            tableElement.style.width = '80%';
                            tableElement.style.margin = '0 auto';
                            tableElement.style.borderCollapse = 'collapse';
                            tableElement.style.marginTop = '20px';
                            
                            // Add table header
                            const thead = document.createElement('thead');
                            const headerRow = document.createElement('tr');
                            const header = document.createElement('th');
                            header.textContent = 'Table Name';
                            header.style.border = '1px solid #ddd';
                            header.style.padding = '8px';
                            header.style.backgroundColor = '#f2f2f2';
                            headerRow.appendChild(header);
                            thead.appendChild(headerRow);
                            tableElement.appendChild(thead);
                            
                            // Add table body with rows
                            const tbody = document.createElement('tbody');
                            data.tables.forEach(table => {
                                const row = document.createElement('tr');
                                const cell = document.createElement('td');
                                // Get the table name from the first property of the object
                                const tableName = Object.values(table)[0];
                                cell.textContent = tableName;
                                cell.style.border = '1px solid #ddd';
                                cell.style.padding = '8px';
                                row.appendChild(cell);
                                tbody.appendChild(row);
                            });
                            tableElement.appendChild(tbody);
                            
                            // Clear the container and add the table
                            tablesContainer.innerHTML = '';
                            tablesContainer.appendChild(tableElement);
                        } else if (data.success && data.tables.length === 0) {
                            tablesContainer.textContent = 'No tables found in the database.';
                        } else {
                            tablesContainer.textContent = 'Error fetching tables: ' + (data.error || 'Unknown error');
                            tablesContainer.classList.add('error');
                        }
                    })
                    .catch(err => {
                        const tablesContainer = document.getElementById('tables-container');
                        tablesContainer.textContent = 'Error fetching tables: ' + err.message;
                        tablesContainer.classList.add('error');
                    });
            }
        </script>
    </body>
    </html>
  `);
});

module.exports = router;