// JavaScript to update the "name" input field based on user selection
    const cryptoSearchInput = document.getElementById('crypto-search');
    const cryptoNameInput = document.getElementById('crypto-name');
    const exitCryptoBoxButton = document.querySelector('.button.exit-add-crypto-box');

    cryptoSearchInput.addEventListener('input', function () {
        cryptoNameInput.value = cryptoSearchInput.value;
    });

    // Function to set the transaction type and submit the form
    function setTransactionType(type) {
        const typeInput = document.createElement('input');
        typeInput.type = 'hidden';
        typeInput.name = 'type';
        typeInput.value = type;

        const form = document.createElement('form');
        form.method = 'post';
        form.action = '/add_trans_to_table';
        form.appendChild(typeInput);

        

        document.body.appendChild(form);

         // Toggle the display of "Close" button
    if (type === 'Buy' || type === 'Sell') {
        exitCryptoBoxButton.style.display = 'block';
    } else {
        exitCryptoBoxButton.style.display = 'none';
    }

        // Add click event listener to the Add button
        const addButton = document.querySelector('.button.add');
addButton.addEventListener('click', () => {
    console.log("Add Pressed in EJS...");

     // Create a new form
    const form = document.createElement('form');
    form.method = 'post';
    form.action = '/add_trans_to_table';

    // Add hidden 'type' input
    const typeInput = document.createElement('input');
    typeInput.type = 'hidden';
    typeInput.name = 'type';
    typeInput.value = type;
    form.appendChild(typeInput);

    // Validate the 'amount' and 'value' fields
    const amountInput = document.querySelector('[name="amount"]');
    const valueInput = document.querySelector('[name="value"]');
    
    if (amountInput.value === '' || isNaN(parseFloat(amountInput.value))) {
        
        return;
    }

    if (valueInput.value === '' || isNaN(parseFloat(valueInput.value))) {
        
        return;
    }

   

    

    document.body.appendChild(form);
    form.submit();
    closeModal();
});
        
}