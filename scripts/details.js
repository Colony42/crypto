// Parse query parameters to get cryptoName and history
const urlParams = new URLSearchParams(window.location.search);
const cryptoName = urlParams.get('cryptoName');
const historyJSON = urlParams.get('history');

// Parse the history JSON and display it
const table = document.getElementById('transactionTable_details').getElementsByTagName('tbody')[0];

if (historyJSON) {
    const history = JSON.parse(historyJSON);
    
    if (history && history.length > 0) {
        history.forEach(transaction => {
            const row = table.insertRow();
            const nameCell = row.insertCell(0);
            const typeCell = row.insertCell(1);
            const amountCell = row.insertCell(2);
            const valueCell = row.insertCell(3);
            const timestampCell = row.insertCell(4);
            
            nameCell.innerHTML = transaction.name;
            typeCell.innerHTML = transaction.type;
            amountCell.innerHTML = transaction.amount;
            valueCell.innerHTML = transaction.value;
            timestampCell.innerHTML = transaction.timestamp;
        });
    } else {
        historyContainer.innerHTML = `<p>No transaction history available for ${cryptoName}.</p>`;
    }
} else {
    historyContainer.innerHTML = '<p>Invalid or missing query parameters.</p>';
}

// Function to go back to the first page
function goBack() {
    window.location.href = 'create_portfolio.html';
  }

  // Get the portfolio information from localStorage and display it on the second page
 const portfolioInfo = JSON.parse(localStorage.getItem('portfolio'));
 if (portfolioInfo) {
   const portfolioName = document.getElementById('portfolio-name');
   const portfolioType = document.getElementById('portfolio-type');
   portfolioName.innerText = `Portfolio Name: ${portfolioInfo.name}`;
   portfolioType.innerText = `Portfolio Type: ${portfolioInfo.type}`;
 }
