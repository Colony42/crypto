function updateGroupCryptos(name, groupCryptos) {
  // Add this part to send the updated group cryptos to the server
  const data = {
    name,
    groupCryptos,
  };

  // Make an HTTP POST request to the server to update group cryptos
  fetch('/update_group_cryptos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.ok) {
        console.log('Group cryptos updated successfully.', response);
        // Calculate the average percentage and update the UI
        updateTotalPercentage();
      } else {
        console.error('Error updating group cryptos:', response.statusText);
      }
    })
    .catch((error) => {
      console.error('Error updating group cryptos:', error);
    });
}

 

let selectPercentage;

async function updateNeedToBuyColumn(percentage, name, color) {
  const table = document.getElementById('transactionTable');
  const rows = table.getElementsByTagName('tr');

  

  selectPercentage = 0; // Update the global variable

  try {
    // Fetch the percentage from the database based on the name of the button
    console.log("name: ", name);

    const response = await fetch(`/get_percentage_by_name?groupName=${name}`);
    const result = await response.json();

    console.log("RESULT: ", result);

    if (result && result.length > 0) {
      // Update the percentage variable with the value from the database
      percentage = result[0].distributed_percent;
    
      console.log("Проценты: ", percentage);
    
      
    }
    else { 
      console.log("Ошибка с запросом: ")
    }

  } catch (error) {
    console.error('Error fetching percentage from the server:', error);
    // Handle error, show user a message, etc.
  }

  // Check if selectedCryptoName is a valid cryptocurrency in the group
  try {
    const groupResponse = await fetch(`/get_percentage_group_cryptos?groupName=${name}`);
    const groupResult = await groupResponse.json();

    console.log("GROUP RESULT: ", groupResult);

    if (groupResult && groupResult.length > 0) {
      const groupCryptos = typeof groupResult[0].linked_cryptocurrencies === 'string'
        ? JSON.parse(groupResult[0].linked_cryptocurrencies)
        : groupResult[0].linked_cryptocurrencies;

      // Calculate the percentage to distribute equally among all cryptocurrencies

      for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        const cells = rows[i].getElementsByTagName('td');

        if (cells.length >= 4) {
          const nameCell = cells[0];
          const priceCell = parseFloat(cells[1].textContent.replace('$', ''));
          const holdingsCell = parseFloat(cells[2].querySelector('span').textContent);
          const needToBuyCell = cells[3];
          const targetDistributionCellElement = cells[3].querySelector('span');
          const targetDistributionCell = targetDistributionCellElement ? parseFloat(targetDistributionCellElement.textContent) : 0;

          const currentBalanceDiv = document.getElementById('__k');
          const balanceText = currentBalanceDiv.textContent.replace('Current Balance: $', '');
          const currentBalance = parseFloat(balanceText);
          
          const howMuchSurCell = cells[4];
          
         selectPercentage = (((priceCell * holdingsCell) / currentBalance) * 100).toFixed(2);

          if (groupCryptos.includes(nameCell.textContent)) {
            howMuchSurCell.textContent = '-';
            needToBuyCell.textContent = '-';

            // Calculate the amount to buy based on the equal percentage and currentBalance
            const amountToBuy = (percentage - selectPercentage) / 100 * currentBalance;

            if (amountToBuy < 0) {
              const overbought = amountToBuy * -1;

              howMuchSurCell.textContent = `Overbought: $ ${overbought.toFixed(2)}`;
              needToBuyCell.textContent = `No need`;

              return (0);
            }

            let errp = 1;

            if (selectPercentage < 5) {
              errp = 0.5;
            }
            else {
              errp = 1;
            }

            // Update the "Need to buy more & how" cell for the selected cryptocurrency
            if (((selectPercentage) < percentage - errp) || ((selectPercentage) > percentage + errp)) {
              needToBuyCell.textContent = `$ ${amountToBuy.toFixed(2)}`;

              targetDistributionCell.textContent = `${percentage} %`;
              console.log("percentage: ", percentage);

            } else {
              needToBuyCell.textContent = `No need`;
              console.log("percentage: ", percentage);
            }
          }
        }
      }

    // Call createButtonGroupInTable only for matching cryptocurrencies
    await createButtonGroupInTable(name, color, groupResult);

    }
  } catch (error) {
    console.error('Error fetching group cryptos from the server:', error);
    // Handle error, show user a message, etc.
  }
}

async function createButtonGroupInTable(name, color, groupResult) {
  const table = document.getElementById('transactionTable');
  const rows = table.getElementsByTagName('tr');

  
  console.log("color В createButtonGroupInTable", color);
  console.log("name В createButtonGroupInTable", name);
  console.log("groupResult В createButtonGroupInTable", groupResult);

  // Check if the name of the cryptocurrency matches an element from groupResult
 
    for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
      const cells = rows[i].getElementsByTagName('td');

      if (cells.length >= 4) {
        const buttonCell = cells[7];
        const nameCell = cells[0];

        if (groupResult.some(group => group.linked_cryptocurrencies.includes(nameCell.textContent))) {

        const groupButton = document.createElement('button');
        groupButton.textContent = name;
        groupButton.classList.add('group-in-table-button');
        groupButton.style.border = `2px solid ${color}`;

        // Add click event to the dynamically created groupButton
        groupButton.addEventListener('click', () => {
          // Call the groupButtonClickHandler function to handle the click event
          groupButtonClickHandler(name);
        });

        // Append groupButton to buttonCell only if it hasn't been appended before
        buttonCell.appendChild(groupButton);

      }
    }
  }
}




async function updateNeedToBuyColumnForTime(percentage, currentBalance, name) {
  const table = document.getElementById('transactionTable');
  const rows = table.getElementsByTagName('tr');

  selectPercentage = 0; // Update the global variable

  try {
    // Fetch the percentage from the database based on the name of the button
    console.log("name: ", name);

    const response = await fetch(`/get_percentage_by_name?groupName=${name}`);
    const result = await response.json();

    console.log("RESULT: ", result);

    if (result && result.length > 0) {
      // Update the percentage variable with the value from the database
      percentage = result[0].distributed_percent;
    
      console.log("Проценты: ", percentage);
    
      // Create a new array with iterators
      const newResult = result.map(item => ({...item, iterator: true}));
    
      console.log("NEW RESULT: ", newResult);
    
      if (newResult && newResult.length > 0) {
        // Update the percentage variable with the value from the database
        percentage = newResult[0].distributed_percent;
    
        console.log("Проценты: ", percentage);
      }
    }
  } catch (error) {
    console.error('Error fetching percentage from the server:', error);
    // Handle error, show user a message, etc.
  }

  // Check if selectedCryptoName is a valid cryptocurrency in the group
  try {
    const groupResponse = await fetch(`/get_percentage_group_cryptos?groupName=${name}`);
    const groupResult = await groupResponse.json();

    console.log("GROUP RESULT: ", groupResult);

    if (groupResult && groupResult.length > 0) {
      const groupCryptos = typeof groupResult[0].linked_cryptocurrencies === 'string'
        ? JSON.parse(groupResult[0].linked_cryptocurrencies)
        : groupResult[0].linked_cryptocurrencies;

      // Calculate the percentage to distribute equally among all cryptocurrencies
      const equalPercentage = percentage / groupCryptos.length;

      for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
        const cells = rows[i].getElementsByTagName('td');

        if (cells.length >= 4) {
          const nameCell = cells[0];
          const priceCell = parseFloat(cells[1].textContent.replace('$', ''));
          const holdingsCell = parseFloat(cells[2].querySelector('span').textContent);
          const needToBuyCell = cells[3];
          const targetDistributionCellElement = cells[3].querySelector('span');
          const targetDistributionCell = targetDistributionCellElement ? parseFloat(targetDistributionCellElement.textContent) : 0;
          
          const howMuchSurCell = cells[4];

          
               
          selectPercentage = (((priceCell * holdingsCell) / currentBalance) * 100).toFixed(2);

          if (groupCryptos.includes(nameCell.textContent)) {
            howMuchSurCell.textContent = '-';
            needToBuyCell.textContent = '-';

            console.log("selectPercentage = ", selectPercentage);

            // Calculate the amount to buy based on the equal percentage and currentBalance
            const amountToBuy = (percentage - selectPercentage) / 100 * currentBalance;

            if (amountToBuy < 0) {
              const overbought = amountToBuy * -1;

              howMuchSurCell.textContent = `Overbought: $ ${overbought.toFixed(2)}`;
              needToBuyCell.textContent = `No need`;

              return (0);
            }

            let errp = 1;

            if (selectPercentage < 5) {
              errp = 0.5;
            }
            else {
              errp = 1;
            }

            // Update the "Need to buy more & how" cell for the selected cryptocurrency
            if (((selectPercentage) < percentage - errp) || ((selectPercentage) > percentage + errp)) {
              needToBuyCell.textContent = `$ ${amountToBuy.toFixed(2)}`;

              targetDistributionCell.textContent = `${percentage} %`;
              console.log("percentage: ", percentage);
            } else {
              needToBuyCell.textContent = `No need`;
              console.log("percentage: ", percentage);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching group cryptos from the server:', error);
    // Handle error, show user a message, etc.
  }
}

// Function to update needToBuyCell and howMuchSurCell columns for all groups
async function updateAllGroups() {
  const table = document.getElementById('transactionTable');
  const rows = table.getElementsByTagName('tr');

  const currentBalanceDiv = document.getElementById('__k');
    const balanceText = currentBalanceDiv.textContent.replace('Current Balance: $', '');
    const currentBalance = parseFloat(balanceText);
  try {
    // Fetch all groups from the database
    const response = await fetch('/get_percentage_groups');
    const groups = await response.json();

    for (const group of groups) {
      const { name, percentage, color, linked_cryptocurrencies } = group;

      // Call the existing function to update the cells for each group
      await updateNeedToBuyColumnForTime(percentage, currentBalance, name);
    }
  } catch (error) {
    console.error('Error fetching groups from the server:', error);
    // Handle error, show user a message, etc.
  }
}


// Set an interval to call the function every 5 minutes
const updateInterval = 5 * 60 * 1010; // 5 minutes
setInterval(() => {
  updateAllGroups();
  console.log("NeedToBuy ОБНОВИЛСЯ");
}, updateInterval);


// Function to update needToBuyCell and howMuchSurCell columns for all groups
async function updateAllGroupsFirst() {
  const table = document.getElementById('transactionTable');
  const rows = table.getElementsByTagName('tr');

  try {
    // Fetch all groups from the database
    const response = await fetch('/get_percentage_groups');
    const groups = await response.json();

    for (const group of groups) {
      const { name, percentage, color, linked_cryptocurrencies } = group;

      // Call the existing function to update the cells for each group
      await updateNeedToBuyColumn(percentage, name, color);
    }
  } catch (error) {
    console.error('Error fetching groups from the server:', error);
    // Handle error, show user a message, etc.
  }
}



window.onload = updateAllGroupsFirst;