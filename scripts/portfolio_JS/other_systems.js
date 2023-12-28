if (!window.userId) {
  window.userId = JSON.parse(localStorage.getItem('user'));
}

function formatNumber(number) {
   // Use toFixed to format the number with 7 decimal places
   const formatted = number.toFixed(7);
 
   // Use a regular expression to remove trailing zeros and the decimal point
   const trimmed = formatted.replace(/(\.0*|0*)$/, '');
 
   // If there are any decimal places remaining, use the trimmed value; otherwise, use it as an integer
   return trimmed.includes('.') ? trimmed : parseInt(trimmed, 10);
 }



 // Function to toggle the transaction details window
function toggleTransactionDetails(ellipsisButton, transactionDetails) {
  if (isTransactionDetailsOpen) {
    // If it's open, close it
    transactionDetails.style.display = 'none';
  } else {
    // If it's closed, open it and position it
    positionTransactionDetails(ellipsisButton, transactionDetails);
    transactionDetails.style.display = 'block';
  }
  // Toggle the flag
  isTransactionDetailsOpen = !isTransactionDetailsOpen;
}

// Function to position the transaction details window
function positionTransactionDetails(ellipsisButton, transactionDetails) {
  // Calculate the position of the ellipsisButton relative to the viewport
  const buttonRect = ellipsisButton.getBoundingClientRect();

  // Position the transaction details window below the ellipsisButton
  transactionDetails.style.top = `${buttonRect.bottom}px`; // Place it below the button
  transactionDetails.style.left = `${buttonRect.left}px`; // Align with the left of the button
}

 // Add click event listener to the Add button
 const addButton = document.querySelector('.button.add');
 addButton.addEventListener('click', () => {
  console.log("Add Pressed...") 
   // Get the selected transaction type
   const selectedTransactionType = document.querySelector('.button.selected').textContent;

   // Get other transaction details
   const cryptoName = document.querySelector('.input-field').value;
   const amount = document.querySelector('.amountInput').value;
   const value = document.querySelector('.valueInput').value;

    
   // Check if all required fields are filled
   if (cryptoName && amount && value) {
     // Add the transaction to the crypto_item_box
     addTransactionToBox(userId, selectedTransactionType, cryptoName, amount, value);

     calculateTotalSum();

     // Clear the form
     closeModal();
   } else {
     // Handle invalid input
     alert('Please fill in all fields.');
   }
 });


     // Event listener for closing the transaction details window
const closeTransactionDetails = document.getElementById('closeTransactionDetails');
if (closeTransactionDetails) {
   closeTransactionDetails.addEventListener('click', () => {
      const transactionDetails = document.querySelector('.transaction-details');
      if (transactionDetails) {
         transactionDetails.style.display = 'none';
      }
   });
}


// Function to save table data to localStorage
function saveTableDataToLocalStorage() {
  const transactionTable = document.querySelector('#transactionTable');
  if (transactionTable) {
    const tableHTML = transactionTable.outerHTML;
    localStorage.setItem('transactionTableData', tableHTML);
  }
}

function handleEllipsisButtonClick(ellipsisButton, transactionDetails) {
  // Add code here to toggle the transaction details
  toggleTransactionDetails(ellipsisButton, transactionDetails);
}

async function handleBasketButtonClick(basketButton) {
  const row = basketButton.closest('tr');

  if (row) {
    const cryptoNameCell = row.querySelector('td:nth-child(1)');
    const cryptoName = cryptoNameCell.textContent;

    // Call the server endpoint to delete the entry
    try {
      const response = await fetch('/delete_transaction', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cryptoName }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete entry from the server.');
      }

      // If the deletion was successful, remove the row from the table
      row.remove();
      calculateTotalSum();
    } catch (error) {
      console.error('Error deleting entry:', error);
      // Handle error, show user a message, etc.
    }
  }
}

function goBack() {
  window.location.href = '/index.html';
}

function closePortfolioSettingsOverlay() {
  const overlay = document.getElementById('portfolioSettingsOverlay');
  overlay.style.display = 'none';
}