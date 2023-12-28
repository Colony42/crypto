function dbPush (userId, cryptoName,transactionType,amount,value) {
   // Create an object to represent the transaction data
   const transactionData = {
     userId: userId,
     name: cryptoName,
     type: transactionType,
     amount: parseFloat(amount),
     value: parseFloat(value),
     timestamp: new Date().toISOString().slice(0, 10), // Current date in YYYY-MM-DD format
   };
 
  
 
   // Send the transaction data to the server
   fetch( '/add_trans_to_table',{
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
 
     
     body: JSON.stringify(transactionData),
   })
     .then(response => {
       if (response.status === 200) {
         console.log('Transaction data sent to the server successfully');
 
          console.log(transactionData, "JSON для отправки в БД")
       } else {
         console.error('Failed to send transaction data to the server');
       }
     })
     .catch(error => {
       console.error('Error:', error);
     });
 }
 
 function addTransFromTableintoDB_Second (userId, cryptoName, amount, newAvgPrice) {
 
   // Create an object to hold the transaction data
   const transactionData = {
     userId: userId,
     name: cryptoName,
     amount: amount,
     newAvgPrice: newAvgPrice,
   };
 
   // Make an HTTP POST request to the server to insert the transaction data
   fetch('/add_trans_to_transactions_table_second', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(transactionData),
   })
     .then((response) => {
       if (response.ok) {
         console.log('Transaction data added to the database  TB');
         
       } else {
         console.error('Error adding transaction data:', response.statusText);
       }
     })
     .catch((error) => {
       console.error('Error adding transaction data:', error);
     });
 
 }
 
 function addTransFromTableintoDB_First (userId, cryptoName, amount, value) {
 
   // Create an object to hold the transaction data
   const transactionData = {
     userId: userId,
     name: cryptoName,
     amount: amount,
     value: value,
   };

   console.log("userId В addTransFromTableintoDB_First: ", userId);
 
   // Make an HTTP POST request to the server to insert the transaction data
   fetch('/add_trans_to_transactions_table_first', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(transactionData),
   })
     .then((response) => {
       if (response.ok) {
         console.log('Transaction data added to the database  TB');
         
       } else {
         console.error('Error adding transaction data:', response.statusText);
       }
     })
     .catch((error) => {
       console.error('Error adding transaction data:', error);
     });
 
 }
 