// Get the slider and color picker elements
const percentageSlider = document.getElementById('percentage-slider');
const selectedPercentage = document.getElementById('selected-percentage');
const colorPicker = document.getElementById('color-picker');
selectedPercentage.textContent = 0 + '%';

  // Add this outside of your event listener function to store selected cryptos for each group
  let groupCryptos = {};
  let allSelectedCryptos = {}; // Initialize allSelectedCryptos as an empty object

  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/get_percentage_groups');
  
      if (!response.ok) {
        throw new Error('Failed to fetch group data from the server.');
      }
  
      const groupData = await response.json();


      const addGroupBtn = document.querySelector('.add-item-group');
      const groupNameInput = document.getElementById('group-name');
      const slider = document.getElementById('percentage-slider');
      const colorPicker = document.getElementById('color-picker');
      const itemContainer = document.querySelector('.settings-portfolio-box-item-contaner');
      const totalPercentageSpan = document.querySelector('.total-percentage');
  
  
      let buttonCount = 0; // Initialize the button count
      let totalPercentage = 0; // Initialize the total percentage
  
      // Function to create a new button based on the group data
     async function createNewButton(groupData) {
        let borderColor;
        let percentage;
        // Add a check to limit the number of buttons to 5
        if (buttonCount >= 5) {
          console.log('Maximum number of buttons reached (5)');
          return;
        }
  
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = '🗑️';
  
        // Initialize groupCryptos for the new group as an array
        groupCryptos[groupData.id] = [];
        // Also clear allSelectedCryptos for the new group
        allSelectedCryptos[groupData.id] = [];
  
        const newButton = document.createElement('button');
        newButton.classList.add('portfolio-button');
        newButton.style.backgroundColor = groupData.color;

        const color = newButton.style.backgroundColor;
        
        newButton.textContent = `${groupData.name} | ${groupData.percentage}%`;
        newButton.appendChild(deleteButton);

        const name = groupData.name;
  
        newButton.id = groupData.name;
        console.log(newButton.id);
  
        groupCryptos[newButton.id] = [];
  
        deleteButton.addEventListener('click', async (event) => {
          event.stopPropagation();
        
          const groupName = newButton.id;
        
          // Remove the button from the UI
          itemContainer.removeChild(newButton);
          buttonCount--;
          totalPercentage -= groupData.percentage;
        
          const currentBalanceDiv = document.getElementById('__k');
          const balanceText = currentBalanceDiv.textContent.replace('Current Balance: $', '');
          const currentBalance = parseFloat(balanceText);
        
          // Call this function initially and whenever you make changes to groups
          updateTotalPercentage();
        
          try {
            // Send a request to your server to delete the group
            const response = await fetch(`/delete_group`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ groupName }), // Send the group name in the request body
            });
        
            if (!response.ok) {
              throw new Error('Failed to delete group from the server.');
            }
        
            // If the deletion was successful, you can perform additional client-side logic if needed
          } catch (error) {
            console.error('Error deleting group:', error);
            // Handle error, show user a message, etc.
          }
        
          // Delay the execution of deleteGroupButton to ensure the UI is updated
          setTimeout(() => {
            deleteGroupButton(groupName);
          }, 0);

          await  updateAllGroupsFirst();

        });

        newButton.addEventListener('click', () => {
          const selectedCryptos = groupCryptos[newButton.id];
        
          selectedCryptos.length = 0; // Clear the array
        
          const modal = document.createElement('div');
          modal.classList.add('crypto-list-modal');
          modal.innerHTML = '<h3 style="margin-left: 20px; padding: 10px; font-size: 20px; border-bottom: 2px solid rgba(0, 190, 260, 0.2);  border-radius: 10px; box-shadow: 0 5px 10px rgba(0, 190, 260, 0.2);">Select a cryptocurrency</h3>';
          modal.style.display = 'flex';
        
          const cryptoList = document.createElement('ul');
          const cryptoRows = document.querySelectorAll('#transactionTable tbody tr');
        
          cryptoRows.forEach((row) => {
            const cryptoName = row.querySelector('td:nth-child(1)').textContent;
            const listItem = document.createElement('li');
            listItem.textContent = cryptoName;
            listItem.classList.add('list-item');
            listItem.style.border = `2px solid #ffffff`;
            listItem.style.borderRadius = '10px';
            listItem.style.padding = '5px';
            listItem.style.marginBottom = '5px';
        
            listItem.addEventListener('click', () => {
              listItem.style.border = `2px solid ${borderColor}`;
              listItem.style.borderRadius = '10px';
              listItem.style.padding = '5px';
        
              const currentBalanceDiv = document.getElementById('__k');
              const balanceText = currentBalanceDiv.textContent.replace('Current Balance: $', '');
              const currentBalance = parseFloat(balanceText);
        
              const selectedCryptoName = listItem.textContent;

               if (selectedCryptos.includes(selectedCryptoName)) {
                  // If the cryptocurrency is already in the group, remove it
                  selectedCryptos.splice(selectedCryptos.indexOf(selectedCryptoName), 1);
               } else {
                  // If it's not in the group, add it
                  selectedCryptos.push(selectedCryptoName);
               }

               

      // Update the groupCryptos in the database
      // Update the groupCryptos and send selectPercentage to the server
      updateGroupCryptos(newButton.id, selectedCryptos);

      updateAllGroupsFirst();

            });
        
            cryptoList.appendChild(listItem);
          });

        
          modal.appendChild(cryptoList);
        
          document.body.appendChild(modal);
        
          const closeModalButton = document.createElement('button');
          closeModalButton.classList.add('close-modal-button');
          closeModalButton.textContent = 'Close';
          modal.appendChild(closeModalButton);
        
          closeModalButton.addEventListener('click', () => {
            modal.style.display = 'none';
          });
        
      });


  
        itemContainer.appendChild(newButton);
        console.log(itemContainer);
  
        groupNameInput.value = '';
        slider.value = 0;
        selectedPercentage.textContent = 0 + '%';
        colorPicker.value = '#FF0';
  
        buttonCount++;
        totalPercentage += groupData.percentage;
  
        // Call this function initially and whenever you make changes to groups
        updateTotalPercentage();
      }
  
      // Loop through the group data and create buttons for each group
      groupData.forEach(group => createNewButton(group));
  
      slider.addEventListener('input', () => {
        const percentage = slider.value;
        selectedPercentage.textContent = percentage + '%';
      });
    
      colorPicker.addEventListener('input', () => {
        const selectedColor = colorPicker.value;
        // You can use the selectedColor value as needed (e.g., for styling elements)
      });


  addGroupBtn.addEventListener('click', async () => {
    if (buttonCount < 5) {
      const name = groupNameInput.value;
      const percentage = parseInt(slider.value);

      if (percentage > 0) {

      if (name.trim() !== '') {
        if (totalPercentage + percentage <= 100) {
          const color = colorPicker.value;


          const deleteButton = document.createElement('button');
          deleteButton.classList.add('delete-button');
          deleteButton.textContent = 'x';

          const newButton = document.createElement('button');
          newButton.classList.add('portfolio-button');
          newButton.style.backgroundColor = color;
          newButton.textContent = `${name} | ${percentage}%`;
          newButton.appendChild(deleteButton);

          newButton.id = name;
          console.log(newButton.id);

          // Initialize groupCryptos for the new group as an array
          groupCryptos[newButton.id] = [];
          // Also clear allSelectedCryptos for the new group
          allSelectedCryptos[newButton.id] = [];

                      // Add this part to send the group data to the server
                      const groupData = {
                        name,
                        percentage,
                        color,
                        groupCryptos
                      };

                      try {
                        const response = await fetch('/add_group_to_percentage_groups', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(groupData),
                        });

                        if (!response.ok) {
                          throw new Error('Failed to add group to the server.');
                        }

                        // If the addition was successful, continue with your client-side logic
                        // ...

                      } catch (error) {
                        console.error('Error adding group:', error);
                        // Handle error, show user a message, etc.
                      }

                      deleteButton.addEventListener('click', async (event) => {
                        event.stopPropagation();
                      
                        const groupName = newButton.id;
                      
                        // Remove the button from the UI
                        itemContainer.removeChild(newButton);
                        buttonCount--;
                        totalPercentage -= groupData.percentage;
                      
                        const currentBalanceDiv = document.getElementById('__k');
                        const balanceText = currentBalanceDiv.textContent.replace('Current Balance: $', '');
                        const currentBalance = parseFloat(balanceText);
                      
                        // Call this function initially and whenever you make changes to groups
                        updateTotalPercentage();
                      
                        try {
                          // Send a request to your server to delete the group
                          const response = await fetch(`/delete_group`, {
                            method: 'DELETE',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ groupName }), // Send the group name in the request body
                          });
                      
                          if (!response.ok) {
                            throw new Error('Failed to delete group from the server.');
                          }
                      
                          // If the deletion was successful, you can perform additional client-side logic if needed
                        } catch (error) {
                          console.error('Error deleting group:', error);
                          // Handle error, show user a message, etc.
                        }
                      
                        
                          deleteGroupButton(groupName);

                        await  updateAllGroupsFirst();
                        
                      });

          const borderColor = newButton.style.borderColor || 'transparent';

          newButton.addEventListener('click', async ()  => {
            const selectedCryptos = groupCryptos[newButton.id];

          await  updateAllGroupsFirst();
          
            selectedCryptos.length = 0; // Clear the array
          
            const modal = document.createElement('div');
            modal.classList.add('crypto-list-modal');
            modal.innerHTML = '<h3>Select a Cryptocurrency</h3';
            modal.style.display = 'flex';
          
            const cryptoList = document.createElement('ul');
            const cryptoRows = document.querySelectorAll('#transactionTable tbody tr');
          
            cryptoRows.forEach((row) => {
              const cryptoName = row.querySelector('td:nth-child(1)').textContent;
              const listItem = document.createElement('li');
              listItem.textContent = cryptoName;
              listItem.classList.add('list-item');
              listItem.style.border = `2px solid #ffffff`;
              listItem.style.borderRadius = '10px';
              listItem.style.padding = '5px';
              listItem.style.marginBottom = '5px';
          
              listItem.addEventListener('click', () => {
                listItem.style.border = `2px solid ${borderColor}`;
                listItem.style.borderRadius = '10px';
                listItem.style.padding = '5px';
          
                const currentBalanceDiv = document.getElementById('__k');
                const balanceText = currentBalanceDiv.textContent.replace('Current Balance: $', '');
                const currentBalance = parseFloat(balanceText);
          
                const selectedCryptoName = listItem.textContent;

        if (selectedCryptos.includes(selectedCryptoName)) {
            // If the cryptocurrency is already in the group, remove it
            selectedCryptos.splice(selectedCryptos.indexOf(selectedCryptoName), 1);
        } else {
            // If it's not in the group, add it
            selectedCryptos.push(selectedCryptoName);
        }

        // Update the groupCryptos in the database
        // Update the groupCryptos and send selectPercentage to the server
        updateGroupCryptos(newButton.id, selectedCryptos);

          updateNeedToBuyColumn(percentage, currentBalance, newButton.id, color);

          
              });
          
              cryptoList.appendChild(listItem);
            });

          
            modal.appendChild(cryptoList);
          
            document.body.appendChild(modal);
          
            const closeModalButton = document.createElement('button');
            closeModalButton.classList.add('close-modal-button');
            closeModalButton.textContent = 'Close';
            modal.appendChild(closeModalButton);
          
            closeModalButton.addEventListener('click', () => {
              modal.style.display = 'none';
            });
          
        });

          itemContainer.appendChild(newButton);
          console.log(itemContainer);

          groupNameInput.value = '';
          slider.value = 0;
          selectedPercentage.textContent = 0 + '%';
          colorPicker.value = '#FF0';

          buttonCount++;
          totalPercentage += percentage;

          // Call this function initially and whenever you make changes to groups
            updateTotalPercentage();
            
          
        } else {
          alert('The total percentage cannot exceed 100%.');
        }
      } else {
        alert('Please enter a group name.');
      }
    } else {
      alert('It is better to choose a percentage greater than 0.');
    }  
  } else {
    alert('You have reached the maximum limit of 5 buttons.');
  }

    
  });
  
    } catch (error) {
      console.error('Error fetching group data:', error);
      // Handle error, show user a message, etc.
    }
  });