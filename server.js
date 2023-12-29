const express = require('express');
const session = require('express-session');
const crypto = require('crypto');

let userId = 0;



const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const axios = require('axios');  // Add this line to import Axios

const CONFIG = require('./scripts/backJS/config.js');
const PORT = process.env.PORT || 3000;
const app = express(); // Create the Express app instance

const updateDatabase = require('./scripts/backJS/updated_DB_coins.js');

app.set('view engine', 'ejs');

const createPath = (page) => path.resolve(__dirname, 'ejs-views', `${page}.ejs`);

// Create a connection to the database
const connection = mysql.createConnection(CONFIG);

// Serve static files from the "styles," "scripts," and "media" directories
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/media', express.static(path.join(__dirname, 'media')));

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);
});

app.use(express.static('styles'));

app.use(express.urlencoded({ extended: false}));

app.get('/', (req, res) => {
  res.render(createPath('index'));
});

// Generate a random secret key
const secretKey = crypto.randomBytes(64).toString('hex');


app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
  })
);


app.get('/create_portfolio.html', (req, res) => {
  userId = req.session.userId; // Retrieve userId from the session


  console.log("userID: ", userId);

  if (!userId) {
    // Redirect or handle unauthorized access
    console.log("error", userId);
    
    res.redirect('/index'); // Redirect to login page if userId is not available
    return;
  }

  const sql = 'SELECT * FROM transactions_table WHERE user_id = ?';

  connection.query(sql, [userId], function (error, result) {
    if (error) {
      console.log("Error:", error);
      res.status(500).send('Error occurred while fetching data from the database');
    } else {
      // Render the 'create_portfolio' template and pass the 'result' as 'transactions' parameter
      res.render(createPath('create_portfolio'), { transactions: result });
    }
  });
});

app.get('/index.html', (req, res) => {
  res.render(createPath('index'));
});

app.get('/login.html', (req, res) => {
  res.render(createPath('index'));
});

app.get('/details.html', (req, res) => {
  const sql = `SELECT * FROM all_tr`;

  connection.query(sql, function (error, result) {
    if (error) {
      console.log("Error:", error);
      res.status(500).send('Error occurred while fetching data from the database');
    } else {
      // Render the 'details' template and pass the 'result' as 'transactions' parameter
      res.render(createPath('details'), { transactions: result });
    }
  });
});





app.use(bodyParser.json());

app.post('/add_trans_to_table', (req, res) => {
  const { userId, name, type, amount, value, timestamp } = req.body;
  const sql = 'INSERT INTO all_tr (user_id, name, type, amount, value, timestamp) VALUES(?, ?, ?, ?, ?, ?)';

  connection.query(sql, [userId, name, type, amount, value, timestamp], (err, results) => {
    if (err) {
      console.log('Error:', err);
      res.status(500).send('Error occurred while adding the transaction');
    } else {
      console.log('Transaction data added to the database');
      dbConnection();
    }
  });
});

app.post('/add_trans_to_transactions_table_second', (req, res) => {
  const { userId, name, amount, newAvgPrice } = req.body;

  const updateSql = 'UPDATE transactions_table SET holdings = ?, avg = ? WHERE name = ? AND user_id = ?';

  connection.query(updateSql, [amount, newAvgPrice, name, userId], (err, results) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).send('Error occurred while updating the transaction in transactions_table');
    } else {
      console.log('Transaction data updated in the transactions_table');
      dbConnection();
      res.sendStatus(200); // Respond with a success status code
    }
  });
});

app.post('/add_trans_to_transactions_table_first', (req, res) => {
  const { userId, name, amount, value} = req.body;

  const sql = 'INSERT INTO transactions_table (user_id, name, holdings, avg) VALUES (?, ?, ?, ?)';

  connection.query(sql, [userId, name, amount, value], (err, results) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).send('Error occurred while adding the transaction to transactions_table');
    } else {
      console.log('Transaction data added to the transactions_table');
      dbConnection();
      res.sendStatus(200); // Respond with a success status code
    }
  });
});

app.delete('/delete_transaction', (req, res) => {
  const { cryptoName } = req.body;

  const deleteSql = 'DELETE FROM transactions_table WHERE name = ? AND user_id = ?';

  connection.query(deleteSql, [cryptoName, userId], (err, results) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).send('Error occurred while deleting the transaction from transactions_table');
    } else {
      console.log('Transaction data deleted from the transactions_table');
      dbConnection();
      res.sendStatus(200); // Respond with a success status code
    }
  });
});


app.post('/add_group_to_percentage_groups', async (req, res) => {
  const { name, percentage, color, groupCryptos } = req.body;

  // Check if the received data is valid
  if (!name || !percentage || !color || !groupCryptos) {
    return res.status(400).send('Invalid data received');
  }

  // Ensure groupCryptos is an array
  const cleanedCryptos = Array.isArray(groupCryptos)
    ? groupCryptos
      .filter((crypto) => crypto && crypto !== '[]')
      .filter((value, index, self) => self.indexOf(value) === index)
    : [];

  // Check the total number of groups before allowing the insertion
  const countGroupsSql = 'SELECT COUNT(*) as totalGroups FROM percentage_groups WHERE user_id = ?';
  
  const userId = req.session.userId; // Retrieve userId from the session

  try {
    const [groupCountResult] = await connection.promise().query(countGroupsSql, [userId]);

    const totalGroups = groupCountResult[0].totalGroups;

    if (totalGroups >= 5) {
      return res.status(400).send('You can only have up to 5 groups.');
    }

    // Proceed with the insertion if the limit is not reached
    const insertSql = 'INSERT INTO percentage_groups (user_id, name, percentage, color, linked_cryptocurrencies) VALUES (?, ?, ?, ?, ?)';

    await connection.promise().query(insertSql, [userId, name, percentage, color, JSON.stringify(cleanedCryptos)]);

    console.log('Group data added to the percentage_groups table');
    res.sendStatus(200); // Respond with a success status code
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred while adding the group to the percentage_groups table');
  }
});


// Update the group cryptos and distributed percent in the database
app.post('/update_group_cryptos', async (req, res) => {
  const { name, groupCryptos } = req.body;

  // Retrieve userId from the session
  const userId = req.session.userId;

  // Check if the received data is valid
  if (!name || !groupCryptos || !Array.isArray(groupCryptos)) {
    return res.status(400).send('Invalid data received');
  }

  try {
    // Check if the cryptocurrency exists in another group
    const checkCryptosSql = 'SELECT name FROM percentage_groups WHERE JSON_CONTAINS(linked_cryptocurrencies, ?, "$.cryptos") AND user_id = ? AND name != ?';

    const [conflictingGroups] = await connection.promise().query(checkCryptosSql, [JSON.stringify(groupCryptos), userId, name]);

    // If the cryptocurrency exists in another group, remove it from those groups
    for (const group of conflictingGroups) {
      const removeFromGroup = group.name;

      // Remove the overlapping cryptocurrency from the existing group
      const removeCryptoSql = 'UPDATE percentage_groups SET linked_cryptocurrencies = JSON_REMOVE(linked_cryptocurrencies, JSON_UNQUOTE(JSON_SEARCH(linked_cryptocurrencies, "one", ?))) WHERE name = ? AND user_id = ?';

      await connection.promise().query(removeCryptoSql, [JSON.stringify(groupCryptos[0]), removeFromGroup, userId]);

      console.log(`Cryptocurrency removed from group: ${removeFromGroup}`);
    }

    // Retrieve the existing linked_cryptocurrencies and percentage from the database
    const getGroupDataSql = 'SELECT linked_cryptocurrencies, percentage FROM percentage_groups WHERE name = ? AND user_id = ?';

    const [groupDataResult] = await connection.promise().query(getGroupDataSql, [name, userId]);

    if (groupDataResult.length === 0) {
      return res.status(404).send('Group not found');
    }

    let existingCryptos = groupDataResult[0].linked_cryptocurrencies;

    // Check if existingCryptos is an object and convert it to an array
    if (existingCryptos && typeof existingCryptos === 'object' && !Array.isArray(existingCryptos)) {
      existingCryptos = Object.values(existingCryptos);
    }

    // Remove empty brackets and duplicates from the existingCryptos array
    existingCryptos = existingCryptos
      .filter((crypto) => crypto && crypto !== '[]')
      .filter((value, index, self) => self.indexOf(value) === index);

    // Remove elements from groupCryptos that are already in existingCryptos
    const newCryptos = groupCryptos.filter((crypto) => !existingCryptos.includes(crypto));

    // Merge the existing and new groupCryptos arrays
    const updatedCryptos = [...existingCryptos, ...newCryptos];

    // Update the linked_cryptocurrencies column with the merged array
    const updateSql = 'UPDATE percentage_groups SET linked_cryptocurrencies = ? WHERE name = ? AND user_id = ?';

    await connection.promise().query(updateSql, [JSON.stringify(updatedCryptos), name, userId]);

    // Check if the percentage property exists in the results
    if ('percentage' in groupDataResult[0]) {
      // Calculate the average percentage
      const averagePercentage = groupDataResult[0].percentage / updatedCryptos.length;

      // Update the distributed_percent column with the calculated average percentage
      const updateDistributedPercentSql = 'UPDATE percentage_groups SET distributed_percent = ? WHERE name = ? AND user_id = ?';

      await connection.promise().query(updateDistributedPercentSql, [averagePercentage, name, userId]);

      console.log('Group cryptos and distributed percent updated in the percentage_groups table');
      res.json({ success: true }); // Respond with a success status code
    } else {
      console.error('Error: Percentage property not found in results');
      res.status(500).send('Error occurred while calculating the average percentage');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred while updating the group cryptos and distributed percent');
  }
});

app.get('/get_percentage_groups', async (req, res) => {
  const userId = req.session.userId; // Retrieve userId from the session
  const sql = 'SELECT * FROM percentage_groups WHERE user_id = ?';

  try {
    const [result] = await connection.promise().query(sql, [userId]);
    res.json(result); // Respond with the retrieved data in JSON format
  } catch (error) {
    console.log("Error:", error);
    res.status(500).send('Error occurred while fetching data from the percentage_groups table');
  }
});

app.delete('/delete_group', async (req, res) => {

  const userId = req.session.userId;

  const { groupName } = req.body;

  const deleteSql = 'DELETE FROM percentage_groups WHERE name = ? AND user_id = ?';

  try {
    await connection.promise().query(deleteSql, [groupName, userId]);
    console.log('Group data deleted from the percentage_groups table');
    res.sendStatus(200); // Respond with a success status code
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error occurred while deleting the group from the percentage_groups table');
  }
});

app.get('/get_percentage_group_cryptos', async (req, res) => {
  const { groupName } = req.query;
  const userId = req.session.userId;

  console.log("GROUP NAME ON SERVER: ", groupName);

  const sql = 'SELECT linked_cryptocurrencies FROM percentage_groups WHERE name = ? AND user_id = ?';

  try {
    const [results] = await connection.promise().query(sql, [groupName, userId]);
    res.json(results); // Respond with the retrieved data in JSON format
    console.log(results);
  } catch (error) {
    console.error('Error fetching group cryptos by name:', error);
    res.status(500).json([]);
  }
});

app.get('/get_percentage_by_name', async (req, res) => {
  const { groupName } = req.query;
  const userId = req.session.userId;

  console.log("GROUP NAME ON SERVER: ", groupName);

  const sql = 'SELECT distributed_percent FROM percentage_groups WHERE name = ? AND user_id = ?';

  try {
    const [results] = await connection.promise().query(sql, [groupName, userId]);
    res.json(results); // Respond with the retrieved data in JSON format
    console.log(results);
  } catch (error) {
    console.error('Error fetching percentage by name:', error);
    res.status(500).json([]);
  }
});


// Change the dbConnection function to use the promise-based API
function dbConnection() {
  const connection = mysql.createConnection(CONFIG);
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
}


// Endpoint to trigger the database update
app.get('/update-database', async (req, res) => {
  try {
    // Call the updateDatabase function with the existing connection
    await updateDatabase(connection);
    res.status(200).send('Database update successful.');
  } catch (error) {
    console.error('Error updating database:', error);
    res.status(500).send('Internal server error.');
  }
});

//ФУНКЦИЮ НИЖЕ НУЖНО БУДЕТ ИЛИ ПЕРЕНЕСТИ ИЗ СЕРВЕРА И ОСТАВИТЬ ТОЛЬКО /update-database ИЛИ ЗАМЕНИТЬ ПЕРЕД хОСТИНГОМ
// Function to trigger the database update on the server
async function triggerDatabaseUpdate() {
  try {
    const response = await axios.get('http://localhost:3000/update-database'); // Change the URL accordingly
    if (response.status !== 200) {
      throw new Error('Server returned a non-200 status code');
    }

    console.log('Database update triggered successfully.');
  } catch (error) {
    console.error('Error triggering database update:', error);
  }
}


// Endpoint to fetch cryptocurrency data from the database
app.get('/api/getCryptocurrencyData', (req, res) => {
  const sql = 'SELECT * FROM coins_table_real_time_up'; // Update the SQL query accordingly

  connection.query(sql, (error, result) => {
    if (error) {
      console.log("Error:", error);
      res.status(500).send('Error occurred while fetching data from the database');
    } else {
      res.json(result); // Respond with the retrieved data in JSON format
    }
  });
});

// Call the function to trigger the database update
triggerDatabaseUpdate();



// Inside your login route in server.js
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT id, password FROM users WHERE email = ?';

  try {
    const [results] = await connection.promise().query(sql, [email]);
    if (results.length > 0) {
      const newUserId = results[0].id;

      const storedHashedPassword = results[0].password;
      const enteredHashedPassword = await hashPassword(password);

      if (storedHashedPassword === enteredHashedPassword) {
        // Passwords match, login successful
        req.session.userId = newUserId; // Store userId in the session
        req.session.userEmail = email; // Store userId in the session
        
        res.status(200).json({ message: 'Login successful', userId: newUserId , userId: newUserId  });

      } else {
        // Passwords don't match, login failed
        res.status(401).json({ message: 'Incorrect email or password' });
      }
    } else {
      // User with the provided email doesn't exist
      res.status(401).json({ message: 'Incorrect email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Function to hash the password using SHA-256
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

app.post('/register', (req, res) => {
  const { email, password, username } = req.body;

  const sql = 'INSERT INTO users (email, password, username) VALUES (?, ?, ?)';

connection.query(sql, [email, password, username], (err, results) => {
    if (err) {
      console.error('Error:', err);
      res.status(500).send('Error occurred while adding the user to users');
    } else {
      console.log('New users data added to the users');
      dbConnection();
      res.sendStatus(200); // Respond with a success status code
    }

  });
});


// Inside routes that require authentication
app.get('/user/portfolio', async (req, res) => {
  
  const { userId } = req.body;
  

  const sql = 'SELECT * FROM transactions_table WHERE user_id = ?';
  try {
    const [results] = await connection.promise().query(sql, [userId]);
    res.json(results);
  } catch (error) {
    console.error('Error fetching user portfolio:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
