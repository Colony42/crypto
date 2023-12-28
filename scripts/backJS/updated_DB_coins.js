const axios = require('axios');
const mysql = require('mysql');

// MySQL database configuration
const dbConfig = {
  host: 'your_host',
  user: 'your_user',
  password: 'your_password',
  database: 'your_database',
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// CoinGecko API URL
const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=1&sparkline=false';

// Modify the updateDatabase function to use async/await with the promise-based API
async function updateDatabase(connection) {
  try {
    // Define the checkQuery variable
    const checkQuery = 'SELECT id, last_updated FROM coins_table_real_time_up WHERE symbol = ?';

    // Fetch data from CoinGecko API
    const response = await axios.get(apiUrl);
    const data = response.data;

    console.log('ЗАПРОС СЕРВЕРА К API')

    // Iterate through the received data and update the database
    for (const crypto of data) {
      const { symbol, name, image, current_price, last_updated } = crypto;

      // Convert the date to MySQL datetime format
      const formattedLastUpdated = new Date(last_updated).toISOString().slice(0, 19).replace('T', ' ');

      // Check if the data needs to be updated in the database
      const [existingData] = await connection.promise().query(checkQuery, [symbol]); // Use the promise-based API

      if (existingData.length > 0) {
        // Update the existing record
        const updateQuery = `
          UPDATE coins_table_real_time_up
          SET symbol = ?, name = ?, image = ?, current_price = ?, last_updated = ?
          WHERE id = ?
        `;
        await connection.promise().query(updateQuery, [symbol, name, image, current_price, formattedLastUpdated, existingData[0].id]);
      } else {
        // Insert new data
        const insertQuery = `
          INSERT INTO coins_table_real_time_up (symbol, name, image, current_price, last_updated)
          VALUES (?, ?, ?, ?, ?)
        `;
        await connection.promise().query(insertQuery, [symbol, name, image, current_price, formattedLastUpdated]);
      }
    }

    console.log('Database update completed.');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    // Set a timeout to call the function again after 6 minutes
    setTimeout(() => updateDatabase(connection), 8 * 60 * 1000); // Schedule the next update after 8 minutes
  }
}

// Export the updateDatabase function
module.exports = updateDatabase;