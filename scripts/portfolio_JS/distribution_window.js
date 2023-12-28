// Function to update the distribution window
function updateDistributionWindow() {
   const transactionTable = document.querySelector('#transactionTable tbody');
   const distributionWindow = document.querySelector('.distribution-window');
 
   if (!transactionTable || !distributionWindow) {
     console.error('Required elements not found in the DOM.');
     return;
   }
 
   // Calculate the total portfolio value
   let totalPortfolioValue = 0;
 
   transactionTable.querySelectorAll('tr').forEach(row => {
     const valueCell = row.querySelector('td:nth-child(2)');
     const holdingsCell = row.querySelector('td:nth-child(3)');
 
     if (valueCell && holdingsCell) {
       const value = parseFloat(valueCell.textContent.replace('$', ''));
       const holdings = parseFloat(holdingsCell.textContent);
 
       if (!isNaN(value) && !isNaN(holdings)) {
         totalPortfolioValue += value * holdings;
       }
     }
   });
 
   // Clear the distribution window
   distributionWindow.innerHTML = '';
 
   // Loop through each row again to calculate and display percentages
   transactionTable.querySelectorAll('tr').forEach(row => {
     const nameCell = row.querySelector('td:nth-child(1)');
     const valueCell = row.querySelector('td:nth-child(2)');
     const holdingsCell = row.querySelector('td:nth-child(3)');
 
     if (nameCell && valueCell && holdingsCell) {
       const name = nameCell.textContent;
       const value = parseFloat(valueCell.textContent.replace('$', ''));
       const holdings = parseFloat(holdingsCell.textContent);
 
       if (!isNaN(value) && !isNaN(holdings)) {
         const percentage = ((value * holdings) / totalPortfolioValue) * 100;
 
         // Create a div to display the coin information
         const coinInfoDiv = document.createElement('div');
         coinInfoDiv.textContent = `${name}: ${percentage.toFixed(2)}%`;
         
         
         // Append the coin information to the distribution window
         distributionWindow.appendChild(coinInfoDiv);
       }
     }
   });
 }