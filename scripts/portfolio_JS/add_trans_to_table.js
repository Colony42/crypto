
 // Flag to track whether the transactionDetails is open or closed
 let isTransactionDetailsOpen = false;

 const userId = JSON.parse(localStorage.getItem('user'));

 check_Coins_DB();

 // Function to calculate and update the sum of all Total values
 function calculateTotalSum() {
  const totalValueSpans = document.querySelectorAll('td:nth-child(3) span:last-child'); // Select all Total spans
  let totalSum = 0;

  // Loop through each Total span and add its value to the totalSum
  totalValueSpans.forEach(span => {
    const totalValue = span.textContent.replace('Total: $', ''); // Remove the 'Total: $' prefix
    totalSum += parseFloat(totalValue);

  });

  // Select the div with id "__k" and update its content with the calculated totalSum
  const currentBalanceDiv = document.getElementById('__k');
  if (currentBalanceDiv) {
    currentBalanceDiv.textContent = `Current Balance: $${totalSum.toFixed(2)}`;
  }

  
}
 


 // Function to calculate and update the total value
 function calculateTotal() {
    // Get the amount and value input elements
    const amountInput = document.querySelector('.amountInput');
    const valueInput = document.querySelector('.valueInput');
    const buyButton = document.querySelector('.buy');
    const sellButton = document.querySelector('.sell');
    const totalValueSpan = document.getElementById('totalValue');
  
    // Check if these elements exist in the DOM
    if (!amountInput || !valueInput || !buyButton || !sellButton || !totalValueSpan) {
      console.error('Required elements not found in the DOM.');
      return;
    }
  
    // Function to calculate and update the total value
    function updateTotal() {
      // Parse amount and value as numbers
      const amount = parseFloat(amountInput.value);
      const value = parseFloat(valueInput.value);
  
      // Check if both amount and value are valid numbers
      if (!isNaN(amount) && !isNaN(value)) {
        // Calculate the total
        const total = (amount * value).toFixed(2);
        // Update the totalValue element
        totalValueSpan.textContent = `$${total}`; // Assuming you want 2 decimal places
      } else {
        // Handle invalid input
        totalValueSpan.textContent = 'Invalid Input';
      }
    }
 
     // Add input event listeners to both amountInput and valueInput
   amountInput.addEventListener('input', updateTotal);
   valueInput.addEventListener('input', updateTotal);
  
    // Add click event listeners to Buy and Sell buttons
    buyButton.addEventListener('click', updateTotal);
 
    // Function to calculate and update the total value
    function updateTotalSell() {
     // Parse amount and value as numbers
     const amount = parseFloat(amountInput.value);
     const value = parseFloat(valueInput.value);
 
     // Check if both amount and value are valid numbers
     if (!isNaN(amount) && !isNaN(value)) {
       // Calculate the total
       const total = (amount * value * -1).toFixed(2);
       // Update the totalValue element
       totalValueSpan.textContent = `$${total}`; // Assuming you want 2 decimal places
     } else {
       // Handle invalid input
       totalValueSpan.textContent = 'Invalid Input';
     }
   }
 
    // Add input event listeners to both amountInput and valueInput
   amountInput.addEventListener('input', updateTotal);
   valueInput.addEventListener('input', updateTotal);
 
    sellButton.addEventListener('click', updateTotalSell);
    calculateTotalSum();
  }
  

 // Call the calculateTotal function to set up the event listeners
 calculateTotal();

function addTransactionToBox(userId, transactionType, cryptoName, amount, value, percentage, currentBalance) {


  const itemContainer = document.querySelector('.settings-portfolio-box-item-contaner');

  const transactionTable = document.querySelector('#transactionTable tbody');


  
if (transactionTable) {
  transactionTable.addEventListener('click', (event) => {
    const target = event.target;
     
    if (target.classList.contains('ellipsis-button')) {
      // Handle ellipsis button click
      const ellipsisButton = target;
      const row = ellipsisButton.closest('tr');
      const transactionDetails = row.querySelector('.transaction-details');
      handleEllipsisButtonClick(ellipsisButton, transactionDetails);
    } else if (target.classList.contains('basket-button')) {
      // Handle basket button click
      const basketButton = target;
      handleBasketButtonClick(basketButton);
    }
  });
}
  

  // Check if a row with the same cryptocurrency name already exists
  const existingRow = Array.from(transactionTable.children).find(row => {
    const nameCell = row.querySelector('td:nth-child(1)'); // Assuming the second column is for cryptocurrency name
    return nameCell && nameCell.textContent === cryptoName;
  });

  if (existingRow) {
    // Update the existing row
    const amountAndTotalCell = existingRow.querySelector('td:nth-child(3)'); // Assuming the third column is for amount and total
    const existingAmountSpan = amountAndTotalCell.querySelector('span:first-child');
    const existingTotalSpan = amountAndTotalCell.querySelector('span:last-child');
    const existingAmount = parseFloat(existingAmountSpan.textContent);
    const existingTotal = parseFloat(existingTotalSpan.textContent.replace('Total: $', ''));
    
     // Get the second column (td:nth-child(2)) which contains the value
  const valueCell = existingRow.querySelector('td:nth-child(2)');

    // Extract the text content and parse it into a number
  const oldValue = parseFloat(valueCell.textContent.replace('$', ''));

  const avgPriceCell = existingRow.querySelector('td:nth-child(6)');
  console.log("avgPriceCell: ", avgPriceCell);
  const oldAvgPrice = parseFloat(avgPriceCell.textContent.replace('$', ''));
  
  
  
  let newAmount, newTotal;
  if (transactionType === 'Buy') {
    newAmount = existingAmount + parseFloat(amount);
    newTotal = existingTotal + (parseFloat(amount) * parseFloat(value));

  } else if (transactionType === 'Sell') {
    newAmount = existingAmount - parseFloat(amount);
    newTotal = existingTotal - (parseFloat(amount) * parseFloat(value));
  }

  
  const newValue = newAmount * oldValue; // Simplified calculation


  const newAvgPrice = (parseFloat(oldAvgPrice) + parseFloat(value)) / 2;

  console.log("oldAvgPrice: ", oldAvgPrice);
  console.log("existingAmount: ", existingAmount);
  console.log("OLD_VALUE: ", oldValue);
  console.log("VALUE: ", parseFloat(value));
  console.log("NEW_VALUE: ", parseFloat(newValue));
  console.log("NEW_AMOUNT: ", parseFloat(newAmount));

  
  console.log("AVG:", newAvgPrice);
    


    // Clear the existing content of the cell
    amountAndTotalCell.innerHTML = '';

    // Create a <span> element for the updated amount
    const amountSpan = document.createElement('span');
    amountSpan.textContent = formatNumber(newAmount);

    // Create a <span> element for the updated total
    const totalSpan = document.createElement('span');
    totalSpan.textContent = `Total: $${(newValue.toFixed(2))}`;
    totalSpan.style.fontSize = '12px'; // Change the font size as needed
    totalSpan.style.color = 'green'; // Change the font color as needed

    // Append the updated amount and total spans to the cell
    amountAndTotalCell.appendChild(amountSpan);
    amountAndTotalCell.appendChild(document.createElement('br')); // Add a line break
    amountAndTotalCell.appendChild(totalSpan);

    let AVG = 0;


    if ((transactionType === 'Sell')) {
      AVG = oldAvgPrice;
      avgPriceCell.textContent = `$ ${AVG.toFixed(2)}`;
    }

    else {
      AVG = newAvgPrice;
      avgPriceCell.textContent = `$ ${AVG.toFixed(2)}`;
    }

    // Calculate the updated total balance
    calculateTotalSum();
   // addTransactionHistory(cryptoName, transactionType, amount, value);
    updateDistributionWindow();
    
    if (itemContainer != 0) {
      // Pass the selected cryptocurrency name to updateNeedToBuyColumn
    updateNeedToBuyColumn(cryptoName, percentage, currentBalance);
    }

    

    checkProfitLoss();

    dbPush(userId, cryptoName,transactionType,amount,value);

    addTransFromTableintoDB_Second (userId, cryptoName, newAmount, AVG);

    updateCryptoPrices();

  } else {

    // Create a new table row for the transaction
    const newRow = document.createElement('tr');//

    

    const nameCell = document.createElement('td');
    nameCell.textContent = cryptoName;

    const valueCell = document.createElement('td');
    valueCell.textContent = `$ ${value}`;

    const avgPriceCell = document.createElement('td');
    avgPriceCell.textContent = `$ ${value}`;

    const profitLossCell = document.createElement('td');
    profitLossCell.textContent = `$ ${0}`;

    const howMuchSurCell = document.createElement('td');
    howMuchSurCell.textContent = `-`;

    // Create a new table data (td) element for amount
    const holdingCell = document.createElement('td');

    // Create a <span> element for the amount part
    const holdingSpan = document.createElement('span');
    holdingSpan.textContent = amount;

    // Calculate total
    const total = (parseFloat(amount) * parseFloat(value));
    

    // Create a <span> element for the total part with different styles
    const totalSpan = document.createElement('span');
    totalSpan.textContent = `Total: $ ${total.toFixed(2)}`;
    totalSpan.style.fontSize = '12px'; // Change the font size as needed
    totalSpan.style.color = 'green'; // Change the font color as needed


    const targetDistributionCell = document.createElement('td');

    // Create a <span> element for the amount part

    // Create table data (td) elements for each column
    const typeSpan = document.createElement('span');
    typeSpan.textContent = '-';

    const targetSpan = document.createElement('span');
    targetSpan.textContent = ``;

    targetSpan.style.fontSize = '12px'; // Change the font size as needed
    targetSpan.style.color = 'green'; // Change the font color as needed



    // Create Action buttons (ellipsis and basket)
    const actionsCell = document.createElement('td');

    const ellipsisButton = document.createElement('button');
    ellipsisButton.textContent = '...';
    ellipsisButton.classList.add('ellipsis-button'); // Add a class for styling

    const basketButton = document.createElement('button');
    basketButton.textContent = '🗑️';
    basketButton.classList.add('basket-button'); // Add a class for styling

    // Create the transaction details window
    const transactionDetails = document.createElement('div');
    transactionDetails.classList.add('transaction-details');
    // Set the initial style to hide it
    transactionDetails.style.display = 'none';

    // Append the ellipsis button and transaction details window to the same parent element
    actionsCell.appendChild(ellipsisButton);
    actionsCell.appendChild(basketButton);
    actionsCell.appendChild(transactionDetails);

    // Add a click event listener to the basketButton
    basketButton.addEventListener('click', () => {
      handleBasketButtonClick(basketButton);
      updateDistributionWindow();
    });

    // Add a click event listener to the ellipsisButton to toggle the transaction details
    ellipsisButton.addEventListener('click', () => {
      // Add a click event listener to each row to display transaction history
        document.querySelectorAll('#transactionTable tbody tr').forEach(row => {
          row.addEventListener('click', () => {
            // Check if the row is disabled
            if (!row.classList.contains('disabled-row')) {
              const cryptoNameCell = row.querySelector('td:nth-child(1)');
              const cryptoName = cryptoNameCell.textContent;
              console.log(`Clicked on ${cryptoName}`);
              displayTransactionHistory(cryptoName);
            }
          });
       });
    });

    // Add an event listener for the window resize event
    window.addEventListener('resize', () => {
      // Update the position of the transaction details window when the window size changes
      if (isTransactionDetailsOpen) {
        positionTransactionDetails(ellipsisButton, transactionDetails);
      }
    });

   

    // Append td elements to the table row
    holdingCell.appendChild(holdingSpan);
    holdingCell.appendChild(document.createElement('br')); // Add a line break
    holdingCell.appendChild(totalSpan);

    // Append td elements to the table row
    targetDistributionCell.appendChild(typeSpan);
    targetDistributionCell.appendChild(document.createElement('br')); // Add a line break
    targetDistributionCell.appendChild(targetSpan);

    newRow.appendChild(nameCell);
    newRow.appendChild(valueCell);
    newRow.appendChild(holdingCell);
    newRow.appendChild(targetDistributionCell);
    newRow.appendChild(howMuchSurCell);
    newRow.appendChild(avgPriceCell);
    newRow.appendChild(profitLossCell);
    newRow.appendChild(actionsCell);

    // Append the table row to the transactionTable
    transactionTable.appendChild(newRow);

    // Calculate the updated total balance
    calculateTotalSum();
//addTransactionHistory(cryptoName, transactionType, amount, value);
    

    checkProfitLoss();
    
    dbPush(userId, cryptoName,transactionType,amount,value);

    addTransFromTableintoDB_First (userId, cryptoName, amount, value);


    updateCryptoPrices();
    
    updateDistributionWindow();
  }

}



async function check_Coins_DB() {
  const tableRows = document.querySelectorAll('#transactionTable tbody tr');
  const pricePromises = [];

  for (const row of tableRows) {
    const name = row.querySelector('th:nth-child(1)').textContent;
    const holdings = row.querySelector('th:nth-child(3)').textContent;
    const avg = row.querySelector('th:nth-child(6)').textContent;

    // Fetch the cryptocurrency price and push the promise into the array
    pricePromises.push(fetchCryptoPrice(name).then(price => {
      // Create a new table row for the transaction
      const newRow = document.createElement('tr');
      newRow.classList.add('new-row'); // Add a class for styling

      const nameCell = document.createElement('td');
      nameCell.textContent = name;

      const valueCell = document.createElement('td');
      valueCell.textContent = `$ ${price}`; // Use the fetched price here

      const avgPriceCell = document.createElement('td');
      avgPriceCell.textContent = `$ ${avg}`;

      const profitLossCell = document.createElement('td');
      profitLossCell.textContent = `$ ${0}`;

      const howMuchSurCell = document.createElement('td');
      howMuchSurCell.textContent = `-`;

      // Create a new table data (td) element for amount
      const holdingCell = document.createElement('td');

      // Create a <span> element for the amount part
      const holdingSpan = document.createElement('span');
      holdingSpan.textContent = holdings;

      // Calculate total
      const total = (parseFloat(holdings) * parseFloat(price));

      // Create a <span> element for the total part with different styles
      const totalSpan = document.createElement('span');
      totalSpan.textContent = `Total: $ ${total.toFixed(2)}`;
      totalSpan.style.fontSize = '12px'; // Change the font size as needed
      totalSpan.style.color = 'green'; // Change the font color as needed

      const targetDistributionCell = document.createElement('td');

      // Create a <span> element for the amount part

      // Create table data (td) elements for each column
      const typeSpan = document.createElement('span');
      typeSpan.textContent = '-';

      const targetSpan = document.createElement('span');
      targetSpan.textContent = '';

      targetSpan.style.fontSize = '12px'; // Change the font size as needed
      targetSpan.style.color = 'green'; // Change the font color as needed

      // Create Action buttons (ellipsis and basket)
      const actionsCell = document.createElement('td');
      actionsCell.classList.add('action-cell'); // Add a class for styling

      const ellipsisButton = document.createElement('button');
      ellipsisButton.textContent = '...';
      ellipsisButton.classList.add('ellipsis-button'); // Add a class for styling

      const basketButton = document.createElement('button');
      basketButton.textContent = '🗑️';
      basketButton.classList.add('basket-button'); // Add a class for styling

      // Create the transaction details window
      const transactionDetails = document.createElement('div');
      transactionDetails.classList.add('transaction-details');
      // Set the initial style to hide it
      transactionDetails.style.display = 'none';

      // Append the ellipsis button and transaction details window to the same parent element
      actionsCell.appendChild(ellipsisButton);
      actionsCell.appendChild(basketButton);
      actionsCell.appendChild(transactionDetails);

      // Add a click event listener to the basketButton
      basketButton.addEventListener('click', () => {
        handleBasketButtonClick(basketButton);
        updateDistributionWindow();
      });

      // Add a click event listener to the ellipsisButton to toggle the transaction details
      ellipsisButton.addEventListener('click', () => {
        // Add a click event listener to each row to display transaction history
        document.querySelectorAll('#transactionTable tbody tr').forEach(row => {
          row.addEventListener('click', () => {
            // Check if the row is disabled
            if (!row.classList.contains('disabled-row')) {
              const cryptoNameCell = row.querySelector('td:nth-child(1)');
              const cryptoName = cryptoNameCell.textContent;
              console.log(`Clicked on ${cryptoName}`);
              displayTransactionHistory(cryptoName);
            }
          });
        });
      });

      // Add an event listener for the window resize event
      window.addEventListener('resize', () => {
        // Update the position of the transaction details window when the window size changes
        if (isTransactionDetailsOpen) {
          positionTransactionDetails(ellipsisButton, transactionDetails);
        }
      });

      // Append td elements to the table row
      holdingCell.appendChild(holdingSpan);
      holdingCell.appendChild(document.createElement('br')); // Add a line break
      holdingCell.appendChild(totalSpan);

      // Append td elements to the table row
      targetDistributionCell.appendChild(typeSpan);
      targetDistributionCell.appendChild(document.createElement('br')); // Add a line break
      targetDistributionCell.appendChild(targetSpan);

row.remove();

      newRow.appendChild(nameCell);
      newRow.appendChild(valueCell);
      newRow.appendChild(holdingCell);
      newRow.appendChild(targetDistributionCell);
      newRow.appendChild(howMuchSurCell);
      newRow.appendChild(avgPriceCell);
      newRow.appendChild(profitLossCell);
      newRow.appendChild(actionsCell);

      

      // Append the table row to the transactionTable
      document.querySelector('#transactionTable tbody').appendChild(newRow);

      // Calculate the updated total balance
      calculateTotalSum();
      updateDistributionWindow();
      checkProfitLoss();
    }));
  }

  // Wait for all price fetches to complete before proceeding
  await Promise.all(pricePromises);
  
  updateCryptoPrices();
}