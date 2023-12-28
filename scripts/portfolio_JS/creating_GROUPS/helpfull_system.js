function deleteGroupButton(groupName) {
   console.log("groupName ", groupName);
   const table = document.getElementById('transactionTable');
   const rows = table.getElementsByTagName('tr');
 
   for (let i = 1; i < rows.length; i++) { // Start from 1 to skip the header row
     const cells = rows[i].getElementsByTagName('td');
 
     if (cells.length >= 4) {
       const buttonCell = cells[7];
 
       // Check if the buttonCell contains a child button with the specific groupName
       const groupButton = buttonCell.querySelector(`button[group-name="${groupName}"]`);
 
       if (groupButton) {
         // Remove existing content in the buttonCell
         buttonCell.innerHTML = '';
         updateAllGroupsFirst();
         const ellipsisButton = document.createElement('button');
         ellipsisButton.textContent = '...';
         ellipsisButton.classList.add('ellipsis-button'); // Add a class for styling
 
         const basketButton = document.createElement('button');
         basketButton.textContent = '🗑️';
         basketButton.classList.add('basket-button'); // Add a class for styling
 
         // Append the ellipsis button and basket button to the buttonCell
         buttonCell.appendChild(ellipsisButton);
         buttonCell.appendChild(basketButton);
 
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
       }
     }
   }
   
 }

 function updateTotalPercentage() {
   const totalPercentageSpan = document.querySelector('.total-percentage');
   const groups = document.querySelectorAll('.portfolio-button');
 
   let totalPercentage = 100;
 
   groups.forEach(group => {
     
     totalPercentage -= extractPercentage(group.textContent);
   });
 
   totalPercentageSpan.textContent = `${totalPercentage}%`;
 }

 function groupButtonClickHandler(name) {
   // Handle the click event of the groupButton here
   console.log(`Button ${name} clicked.`);
   // You can call the groupButton function here if needed
   createWindow(name);
 }
 
 function createWindow(name) {
   // Create the window that appears on button click
   const windowContainer = document.createElement('div');
   windowContainer.classList.add('window-container');
   windowContainer.style.width = '100px'; // Set the desired width
   windowContainer.style.height = '150px'; // Set the desired height
   windowContainer.style.position = 'absolute';
   windowContainer.style.display = 'none'; // Initially hide the window
 
   // Add buttons from itemContainer to the window
   itemContainer.querySelectorAll('.portfolio-button').forEach((button) => {
     const clonedButton = button.cloneNode(true);
     clonedButton.addEventListener('click', () => {
       // Handle button click inside the window
       console.log(`Button ${clonedButton.textContent} clicked in the window.`);
     });
     windowContainer.appendChild(clonedButton);
   });
 
   // Append the window to the body
   document.body.appendChild(windowContainer);
 
   // Add click event to the windowContainer to toggle the window
   windowContainer.addEventListener('click', () => {
     windowContainer.style.display = 'none';
   });
 
   // Set the position of the window relative to the groupButton
   const groupButton = document.querySelector('.group-in-table-button');
   const rect = groupButton.getBoundingClientRect();
   const buttonLeft = rect.left;
   const buttonTop = rect.top;
   windowContainer.style.left = `${buttonLeft - parseInt(windowContainer.style.width, 10)}px`;
   windowContainer.style.top = `${buttonTop}px`;
   windowContainer.style.border = '2px solid #D2D2D4';
   windowContainer.style.zIndex = '1200';
 
   // Toggle the window's visibility
   windowContainer.style.display = windowContainer.style.display === 'none' ? 'block' : 'none';
 }

 function extractPercentage(buttonText) {
   const percentagePattern = /(\d+)%/;
   const match = buttonText.match(percentagePattern);
   if (match && match.length > 1) {
     return parseInt(match[1]);
     
   }
   return 0; // Return 0 if no percentage is found
 }

 let isSliderEnabled = true; // Variable to control the slider behavior
let clickStartTimestamp = 0;
let sliderTimeout; // Variable to store the timeout ID

// Function to handle slider behavior
const handleSlider = () => {
  if (isSliderEnabled) {
    const rawPercentage = percentageSlider.value;
    const roundedPercentage = Math.round(rawPercentage / 5) * 5;
    percentageSlider.value = roundedPercentage;
    selectedPercentage.textContent = roundedPercentage + '%';
  }
};

percentageSlider.addEventListener('mousedown', () => {
  clickStartTimestamp = Date.now();

  // Check for long press (more than 3 seconds) while the button is held
  sliderTimeout = setTimeout(() => {
    isSliderEnabled = false;
    clearTimeout(sliderTimeout); // Clear the timeout
  }, 1000); // 1000 milliseconds = 1 seconds
  handleSlider();
});

percentageSlider.addEventListener('mouseup', () => {
  if (!isSliderEnabled) {
    isSliderEnabled = true; // Re-enable the slider sticking
  }
  clearTimeout(sliderTimeout); // Clear the timeout
});

percentageSlider.addEventListener('mousemove', () => {
  // Check if the mouse button is still down and the user has held it for more than 1 seconds
  if (Date.now() - clickStartTimestamp > 1000) {
    isSliderEnabled = false;
  }
  handleSlider();
});

// Add an additional check in case the mouse button is released outside of the slider
document.addEventListener('mouseup', () => {
  if (!isSliderEnabled) {
    isSliderEnabled = true;
  }
  clearTimeout(sliderTimeout);
});

percentageSlider.addEventListener('input', () => {
  handleSlider();
});

colorPicker.addEventListener('input', () => {
  const selectedColor = colorPicker.value;
  // You can use the selectedColor value as needed (e.g., for styling elements)
});
