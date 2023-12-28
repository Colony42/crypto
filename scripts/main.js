 

      let selectedPortfolioType = '';

      
      const backButton = document.querySelector('.back-button');
      backButton.style.display = 'none';

      function soon () {
        if (selectedPortfolioType === "Stocks") {
          selectedPortfolioType = 'Crypto';
          alert ("The ability to create a STOCKS portfolio will be available SOON =)");
          return;
        }

        if (selectedPortfolioType === "Currency") {
          selectedPortfolioType = 'Crypto';
          alert ("The ability to create a CURRENCY portfolio will be available SOON =)");
          return;
        }
        
      }

      const portfolioInfo = document.getElementById('portfolioInfo');
      portfolioInfo.style.display = 'none';

      // Function to handle button click and show portfolio input
      function showPortfolioInput(event) {

          backButton.style.display = 'flex';

          // Get the selected portfolio type from the clicked button's data attribute
          selectedPortfolioType = event.target.getAttribute("data-type");

          soon ();

          // ВОТ СЮДА ВСТАВИТЬ КОД КОТОРЫЙ хРАНИТСЯ В ПАПКЕ Crypto "Типы порфтелей..."

            const buttonContainer = document.querySelector(".button-container");
            const portfolioContainer = document.querySelector(".portfolio-container");

            buttonContainer.classList.add("blur-out");
            portfolioContainer.classList.remove("blur-out");
    
          

          

        updateSelectedButton(event.target); // Highlight selected button
      }

     // Add event listeners to the additional buttons for hover descriptions
          document.querySelector(".button.born-hodl").addEventListener("mouseover", function () {
            showDescription("born-hodl-description");
          });
          document.querySelector(".button.risky-hodler").addEventListener("mouseover", function () {
            showDescription("risky-hodler-description");
          });
          document.querySelector(".button.need-more-risk").addEventListener("mouseover", function () {
            showDescription("need-more-risk-description");
          });
          document.querySelector(".button.real-cryptomen").addEventListener("mouseover", function () {
            showDescription("real-cryptomen-description");
          });
          document.querySelector(".button.pro").addEventListener("mouseover", function () {
            showDescription("pro-description");
          });

              // Function to show the description based on the provided class name
          function showDescription(descriptionClassName) {
            // Hide all descriptions first
            const descriptions = document.querySelectorAll(".button-descriptions > p");
            descriptions.forEach(description => {
              description.style.display = "none";
            });

            // Show the specific description based on the provided class name
            const descriptionToShow = document.querySelector(`.button-descriptions > p.${descriptionClassName}`);
            descriptionToShow.style.display = "block";
          }

          

      function updateSelectedButton(selectedButton) {
        const buttons = document.querySelectorAll('.button');
  
        buttons.forEach(button => {
        button.classList.remove('selected');
        button.style.border = '2px solid #707070'; // Reset border style
        });

        selectedButton.classList.add('selected');
        selectedButton.style.border = '2px solid #ffffff'; // Add border to selected button
      }

    const contentBox = document.querySelector('container');
    
    function showPortfolioVariation() {
      const buttonCreateStart = document.querySelector('.button_create_start');
      const buttonContainer = document.querySelector('.button-container');
      const portfolioContainer = document.querySelector('.portfolio-container');
      const portfolioInfo = document.getElementById('portfolioInfo');
      

      const loginRegModal = document.getElementById('loginRegModal');
        loginRegModal.style.display = 'flex';

      buttonCreateStart.style.display = 'none'; // Hide the "+ Create" button
      buttonContainer.style.display = 'flex'; // Show the rest of the elements
      portfolioContainer.style.display = 'flex';
      portfolioInfo.style.display = 'none';

      buttonCreateStart.style.display = 'none'; // Hide the "+ Create" button

      
      
      }

      function hideWindowCreate () {
        const buttonCreateStart = document.querySelector('.button_create_start');
      const buttonContainer = document.querySelector('.button-container');
      const portfolioContainer = document.querySelector('.portfolio-container');
      const vidget = document.getElementById('vidTrade');
      const portfolioInfo = document.getElementById('portfolioInfo');
      const por = document.getElementById ('portfolioPac');

      const loginRegModal = document.getElementById('loginRegModal');

        loginRegModal.style.display = 'flex';

        por.classList.add('left-animation');
        buttonCreateStart.classList.add('left-animation');
        buttonContainer.classList.add('left-animation');
        portfolioContainer.classList.add('left-animation');
        portfolioInfo.classList.add('left-animation');
        vidget.classList.add('right-animation');

        setTimeout(() => {
          loginRegModal.style.display = 'flex';
          // Trigger the opacity transition
          loginRegModal.style.opacity = '1';
        }, 300); // Adjust the time based on your n
      }

      function unHideWindowCreate() {
        const buttonCreateStart = document.querySelector('.button_create_start');
        const buttonContainer = document.querySelector('.button-container');
        const portfolioContainer = document.querySelector('.portfolio-container');
        const vidget = document.getElementById('vidTrade');
        const portfolioInfo = document.getElementById('portfolioInfo');
        const por = document.getElementById('portfolioPac');
  
        const loginRegModal = document.getElementById('loginRegModal');
  
        loginRegModal.style.display = 'none';
        loginRegModal.style.opacity = '0';

          por.classList.remove('left-animation');
          buttonCreateStart.classList.remove('left-animation');
          buttonContainer.classList.remove('left-animation');
          portfolioContainer.classList.remove('left-animation');
          portfolioInfo.classList.remove('left-animation');
          vidget.classList.remove('right-animation');
  
            
          


      }
      // Constructor function to create a Portfolio object
      function Portfolio(name, type) {
        this.name = name;
        this.type = type;
      }
  
      function createPortfolio() {
        const errorHint = document.getElementById('errorHint');
        const nameInput = document.getElementById('portfolio-name');
        const buttonCreateStart = document.querySelector('.button_create_start');
        const name = nameInput.value.trim();

          if (name === '' || selectedPortfolioType === '') {
            errorHint.style.display = 'block';
            return;
          }

            // Reset the error hint's display when everything is filled correctly
            errorHint.style.display = 'none';

            const portfolio = { name, type: selectedPortfolioType };
            localStorage.setItem('portfolio', JSON.stringify(portfolio)); // Store the portfolio information in localStorage

              // Show portfolio information and hide other elements
              const portfolioInfo = document.getElementById('portfolioInfo');
              portfolioInfo.innerText = `Portfolio Name: ${portfolio.name}, Type: ${portfolio.type}`;
              portfolioInfo.style.display = 'flex';
              buttonCreateStart.style.display = 'flex';
              

              // Hide other elements
              const button_container = document.querySelector('.button-container');
              button_container.style.display = 'none';

          const backButton = document.querySelector('.back-button');
          backButton.style.display = 'none';
//
          const portfolio_container = document.querySelector('.portfolio-container');
          portfolio_container.style.display = 'none';
       }


      function goToCreatePortfolioPage() {
        window.location.href = 'create_portfolio.html';
      }


      function displayCreatedPortfolio(portfolio) {
        // Hide the input field and create button
        const portfolioContainer = document.querySelector(".portfolio-container");
        portfolioContainer.classList.add("blur-out");
  
        // Create the portfolio display element
        const portfolioDisplay = document.createElement("div");
        portfolioDisplay.classList.add("portfolio-display");
        portfolioDisplay.innerHTML = `<h2>${portfolio.name}</h2><p>Type: ${portfolio.type}</p>`;
  
        // Append the portfolio display to the body
        document.body.appendChild(portfolioDisplay);
      }
  
      // Add click event listeners to buttons
      document.querySelector(".currency").addEventListener("click", showPortfolioInput);
      document.querySelector(".stocks").addEventListener("click", showPortfolioInput);


      function goBack() {
      window.location.href = 'index.html';
      }
      
      
      function closeModal() {
        const loginModal = document.getElementById('loginModal');
        const registerModal = document.getElementById('registerModal');
      
        loginModal.style.display = 'none';
        registerModal.style.display = 'none';
      }
      
      const em = JSON.parse(localStorage.getItem('useremail'));

      

      if(!em) {

        logoutBtn.style.display = "none";

        logInRightBtn.style.display = "flex";

      }
      else {
        logoutBtn.style.display = "flex";

        logInRightBtn.style.display = "none";
      }

      
  logoutBtn.addEventListener('click',  () => {
   logoutUser();
  });

 
  logInRightBtn.addEventListener('click',  () => {

    hideWindowCreate();
    
  });


      const userEmailSpan = document.getElementById('user-email');

      console.log("EMAIL IN START MAIN: ", em);
      userEmailSpan.textContent = em;
    

      const porBtn = document.getElementById('portfolioCreate');

      porBtn.addEventListener('click', () => {

        ID = JSON.parse(localStorage.getItem('user'));
      console.log("ID IN START MAIN: ", ID);

        if (!ID) {
          console.log("ID IN : ", ID);
          hideWindowCreate();
        }
          

        else {
          unHideWindowCreate();
      showPortfolioVariation();
        }
          
          
      });

