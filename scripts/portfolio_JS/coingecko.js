const apiUrl = '/api/getCryptocurrencyData';

// Initialize the topCryptos array to store cryptocurrency names
let topCryptos = [];
let priceCryptos = [];
let cryptoData = [];

let cryptoPriceData = {};

const itemContainer = document.querySelector('.settings-portfolio-box-item-contaner');

let cryptoDataPars = '';

// Function to fetch cryptocurrency names from the API
async function fetchCryptocurrencyDataFromDB() {
  try {
    // Make a request to your server endpoint that fetches data from the MySQL database
    const response = await fetch(apiUrl); // Replace with your actual server endpoint
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Extract the cryptocurrency names and add them to the topCryptos array
    topCryptos = data.map(crypto => crypto.name);
    cryptoPriceData = data.reduce((acc, crypto) => {
      acc[crypto.name] = crypto.current_price;
      return acc;
    }, {});

    // Now, you have the cryptocurrency names in the topCryptos array
    console.log(topCryptos);
    console.log(cryptoPriceData);
  } catch (error) {
    console.error('Error fetching cryptocurrency data from the database:', error);
  } finally {
    // Set a timeout to re-fetch data after 5 minutes (300,000 milliseconds)
    setTimeout(fetchCryptocurrencyDataFromDB, 600000);
  }
}

// Function to initialize the cryptocurrency data
async function initializeCryptocurrencyData() {
  if (isTimeToRefreshData()) {
    // Fetch the data if it's time to refresh
    await fetchCryptocurrencyDataFromDB();
  } else {
    // Load data from local storage
    loadCryptocurrencyDataFromLocalStorage();
  }
}

// Call the function to initialize the cryptocurrency data
initializeCryptocurrencyData();

// Function to check if it's time to refresh the data
function isTimeToRefreshData() {
  const storedData = localStorage.getItem('cryptoData');
  if (!storedData) {
    return true; // Data doesn't exist in local storage, fetch it.
  }

  const parsedData = JSON.parse(storedData);
  const currentTime = new Date().getTime();
  const timeElapsed = currentTime - parsedData.timestamp;

  // Check if more than 5 minutes (300,000 milliseconds) has passed since the last update
  return timeElapsed > 600000;
}

// Function to load data from local storage
function loadCryptocurrencyDataFromLocalStorage() {
  const storedData = localStorage.getItem('cryptoData');
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    topCryptos = parsedData.data;
  }
}

// Fetch the price of a selected cryptocurrency
async function fetchCryptoPrice(selectedCrypto) {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const cryptoData = data.find(crypto => crypto.name.toLowerCase() === selectedCrypto.toLowerCase());

    if (cryptoData) {
      const price = cryptoData.current_price;

      // Store the price data in the cryptoPriceData object
      cryptoPriceData[selectedCrypto] = price;

      // Update the amountInput field with the fetched price
      const valueInput = document.querySelector('.valueInput');
      valueInput.value = price;

      // Update the total value if needed
    } else {
      console.error(`Cryptocurrency data not found for ${selectedCrypto}`);
    }
  } catch (error) {
    console.error('Error fetching cryptocurrency price:', error);
  }
}


    // Function to handle selecting a cryptocurrency from the dropdown list
function handleCryptoSelection(selectedCrypto) {
  // Set the selected cryptocurrency in the input field
  searchInput.value = selectedCrypto;

  // Fetch and set the price for the selected cryptocurrency with a 1-minute timeout
  const cryptoPriceTimeout = setTimeout(() => {
    console.log(`fetchCryptoPrice(${selectedCrypto}) timed out after 1 minute.`);
  }, 60000); // 1 minute in milliseconds

  fetchCryptoPrice(selectedCrypto).finally(() => {
    clearTimeout(cryptoPriceTimeout); // Clear the timeout when the data is loaded
  });

  // Clear the dropdown list
  dropdownList.innerHTML = '';
}



 // Get the search input and the dropdown list
 const searchInput = document.querySelector('.input-field');
 const dropdownList = document.querySelector('.dropdown-list');

 // Event listener to toggle the dropdown list on input field click
 searchInput.addEventListener('click', function () {
   // Toggle the display property of the dropdown list
   dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
 });

 // Event listener to close the dropdown list when clicking outside of it
 document.addEventListener('click', function (event) {
   if (!searchInput.contains(event.target) && !dropdownList.contains(event.target)) {
     dropdownList.style.display = 'none';
   }
 });

 // Function to filter and update the dropdown list based on user input
 function updateDropdown() {
   const searchTerm = searchInput.value.toLowerCase();
   const filteredCryptos = topCryptos.filter(crypto =>
     crypto.toLowerCase().includes(searchTerm)
   );

   // Clear the previous dropdown content
   dropdownList.innerHTML = '';

   // Add the filtered cryptocurrencies to the dropdown
   filteredCryptos.forEach(crypto => {
     const listItem = document.createElement('div');
     listItem.textContent = crypto;
     listItem.classList.add('dropdown-item');
     listItem.addEventListener('click', () => {
       // Set the selected cryptocurrency in the input field
       searchInput.value = crypto;
       // Clear the dropdown list
       dropdownList.innerHTML = '';
     });
     dropdownList.appendChild(listItem);
   });
 }

 // Listen for input events on the search input
 searchInput.addEventListener('input', updateDropdown);


  // Step 1: Identify the target cells (you can use IDs or column positions)
  const nameCell = document.querySelector('th:nth-child(1)'); // Replace with the actual position or ID of the Name cell
  const priceCell = document.querySelector('th:nth-child(2)'); // Replace with the actual position or ID of the Price cell


 // Event listener to handle selecting a cryptocurrency from the dropdown list
dropdownList.addEventListener('click', function (event) {
   const selectedCrypto = event.target.textContent;

   
 
   // Handle the cryptocurrency selection
   handleCryptoSelection(selectedCrypto);
 });



 async function updateCryptocurrencyPrices() {
  try {
    const response = await fetch(apiUrl); // Replace with your actual server endpoint
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Loop through the table rows and update the "Price" cell for each cryptocurrency
    const rows = document.querySelectorAll('#transactionTable tbody tr');
    rows.forEach(async (row) => {
      const cryptoNameCell = row.querySelector('td:nth-child(1)');
      const cryptoName = cryptoNameCell.textContent;
      const priceCell = row.querySelector('td:nth-child(2)');
      const priceData = data.find(crypto => crypto.name === cryptoName);

      if (priceData) {
        const price = priceData.current_price;
        priceCell.textContent = `$ ${price.toFixed(2)}`;
      }

      // Calculate the updated total holdings value and update the cell
      const holdingsTotalAmount = parseFloat(row.querySelector('td:nth-child(3) span:first-child').textContent);
      const updatedHoldingsTotal = holdingsTotalAmount * priceData.current_price;
      const holdingsTotalCell = row.querySelector('td:nth-child(3) span:last-child');
      holdingsTotalCell.textContent = `Total: $${updatedHoldingsTotal.toFixed(2)}`;

      
    });

    // Update other elements (e.g., calculate profit/loss, total balance, etc.)
    checkProfitLoss();
    updateDistributionWindow();
    calculateTotalSum();

  } catch (error) {
    console.error('Error updating cryptocurrency prices:', error);
  }
}


// Update cryptocurrency prices every 5 minutes (300,000 milliseconds)
setInterval(updateCryptocurrencyPrices, 300000);



async function updateCryptoPrices () {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    // Loop through the table rows and update the "Price" cell for each cryptocurrency
    const rows = document.querySelectorAll('#transactionTable tbody tr');
    rows.forEach(async (row) => {
      const cryptoNameCell = row.querySelector('td:nth-child(1)');
      const cryptoName = cryptoNameCell.textContent;
      const priceCell = row.querySelector('td:nth-child(2)');
      const priceData = data.find(crypto => crypto.name === cryptoName);

      if (priceData) {
        const price = priceData.current_price;
        priceCell.textContent = `$ ${formatNumber(price)}`;
      }

      // Calculate the updated total holdings value and update the cell
      const holdingsTotalAmount = parseFloat(row.querySelector('td:nth-child(3) span:first-child').textContent);
      const updatedHoldingsTotal = holdingsTotalAmount * priceData.current_price;
      const holdingsTotalCell = row.querySelector('td:nth-child(3) span:last-child');
      holdingsTotalCell.textContent = `Total: $${updatedHoldingsTotal.toFixed(2)}`;

      
    });

    // Update other elements (e.g., calculate profit/loss, total balance, etc.)
    checkProfitLoss();
    updateDistributionWindow();
    calculateTotalSum();

  } catch (error) {
    console.error('Error updating cryptocurrency prices:', error);
  }
}