let transactionHistory = {};

 // Function to add a transaction to the transaction history
 function addTransactionHistory(cryptoName, transactionType, amount, value) {
   if (!transactionHistory[cryptoName]) {
     transactionHistory[cryptoName] = [];
   }
 
   // Create a transaction object and add it to the history
   const transaction = {
     name: cryptoName,
     type: transactionType,
     amount: amount,
     value: value,
     timestamp: new Date().toLocaleString(),
   };
 
   transactionHistory[cryptoName].push(transaction);
 
   
}

// Function to display transaction history in the details.html page
function displayTransactionHistory(cryptoName) {

  const history = transactionHistory[cryptoName];
  if (!history) return (console.log(`No history found`)); // No history found

  console.log(`Displaying history for ${cryptoName}`);

  // Create a JSON representation of the history to pass to details.html
  const historyJSON = JSON.stringify(history);

  // Open details.html and pass the history as a query parameter
  window.location.href = `details.html?cryptoName=${cryptoName}&history=${historyJSON}`;

}

