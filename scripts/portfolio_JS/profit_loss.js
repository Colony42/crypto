function checkProfitLoss() {
   const prices = document.querySelectorAll('td:nth-child(2)');
   const avgCells = document.querySelectorAll('td:nth-child(6)');
   const profitLossCells = document.querySelectorAll('td:nth-child(7)');
   const holdingsCells = document.querySelectorAll('td:nth-child(3)');
 
   for (let i = 0; i < prices.length; i++) {
     const price = parseFloat(prices[i].textContent.replace('$', ''));
     const avgCell = parseFloat(avgCells[i].textContent.replace('$', ''));
     const holdings = parseFloat(holdingsCells[i].textContent);
 
     const profitOrLoss = (price - avgCell) * holdings;
     let textPL = '';
     let color = '';
 
     if (profitOrLoss > 0) {
       textPL = '+';
       color = 'green';
     } else if (profitOrLoss === 0) {
       textPL = '';
       color = 'gray';
     }
     else {
       textPL = '-';
       color = 'red';
     }
 
     // Update profitLossCells[i] with the formatted number
     profitLossCells[i].textContent = `${textPL} $ ${(Math.abs(profitOrLoss.toFixed(2)))}`;
     profitLossCells[i].style.color = color;
     }
 }