
function selectCurrency() {
   const currencySelect = document.getElementById('currencySelect');
   const selectedCurrency = currencySelect.value;
   // You can use the selectedCurrency value for further processing
 }

 // Function to add or remove the 'selected' class from Buy and Sell buttons
 function toggleButtonSelection(button) {
   const buttons = document.querySelectorAll('.button.buy, .button.sell');
   buttons.forEach(btn => btn.classList.remove('selected'));
   button.classList.add('selected');
 }

 // Add click event listeners to Buy and Sell buttons
 const buyButton = document.querySelector('.button.buy');
 const sellButton = document.querySelector('.button.sell');

 buyButton.addEventListener('click', () => {
   toggleButtonSelection(buyButton);
 });

 sellButton.addEventListener('click', () => {
   toggleButtonSelection(sellButton);
 });

 // Function to go back to the first page
 function goHistoryPage() {
   window.location.href = 'details.html';
 }

 // Function to open the modal dialog
 function openModal() {
   const modalOverlay = document.getElementById('modalOverlay');
   modalOverlay.style.display = 'flex';
 }

 
 

  // Function to open the PorfolioSettings dialog
 function openPorfolioSettings() {
  const portfolio_SettingsOverlay = document.getElementById('portfolioSettingsOverlay');
  portfolio_SettingsOverlay.style.display = 'flex';
 }

 function closePorfolioSettings() {
  const portfolio_SettingsOverlay = document.getElementById('portfolioSettingsOverlay');
  portfolio_SettingsOverlay.style.display = 'none';
 }

 // Function to close the modal dialog
 function closeModal() {
   const modalOverlay = document.getElementById('modalOverlay');
   const amountInput = document.querySelector('.amountInput');
   const valueInput = document.querySelector('.valueInput');
   const totalValueSpan = document.getElementById('totalValue');
   const inputField = document.querySelector('.input-field');

   // Clear the form inputs and total value
   amountInput.value = '';
   valueInput.value = '';
   totalValueSpan.textContent = '0';
   inputField.value = '';
   modalOverlay.style.display = 'none';
 }

 // Get the portfolio information from localStorage and display it on the second page
 const portfolioInfo = JSON.parse(localStorage.getItem('portfolio'));
 if (portfolioInfo) {
   const portfolioName = document.getElementById('portfolio-name');
   const portfolioType = document.getElementById('portfolio-type');
   portfolioName.innerText = `Portfolio: ${portfolioInfo.name}`;
   portfolioType.innerText = `Type: ${portfolioInfo.type}`;
 }
