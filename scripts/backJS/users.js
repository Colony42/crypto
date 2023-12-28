let ID = 0;
let emailInfo = '';

async function add_NewUser_To_DB() {
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const username = document.getElementById('regName').value;

  // Check minimum username length
  if (username.length < 3) {
    console.error('Username must be at least 3 characters');
    alert('Username must be at least 3 characters');
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error('Invalid email format');
    alert('Invalid email format');
    return;
  }

  // Check minimum password length
  if (password.length < 6) {
    console.error('Password must be at least 6 characters');
    alert('Password must be at least 6 characters');
    return;
  }

  // Hash the password using SHA-256
  const passwordHash = await hashPassword(password);

  // Create an object to hold the transaction data
  const transactionData = {
    email: email,
    password: passwordHash, // Store the hash instead of the original password
    username: username,
  };

  // Make an HTTP POST request to the server to insert the transaction data
  try {
    const response = await fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (response.ok) {
      console.log('New User data added to the database');

      alert ("Success!");

    } else {
      console.error('Error adding New User data:', response.statusText);
    }
  } catch (error) {
    console.error('Error adding New User data:', error);
  }
}

const addUserBtn = document.getElementById('regButton');

addUserBtn.addEventListener('click', async () => {
  try {
    await add_NewUser_To_DB();
  } catch (error) {
    console.error('Error fetching group data:', error);
    // Handle error, show user a message, etc.
  }

});

// Function to hash the password using SHA-256
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Inside users.js
async function fetchUserPortfolio(userId) {
  try {
    const response = await fetch(`/user/portfolio?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const portfolioData = await response.json();
      goToCreatePortfolioPage();
      displayCreatedPortfolio(portfolioData);
    } else {
      console.error('Error fetching user portfolio:', response.statusText);
    }
  } catch (error) {
    console.error('Error fetching user portfolio:', error);
  }
}



async function logIn() {
  const email = document.getElementById('logEmail').value;
  const password = document.getElementById('logPass').value;

  console.log("EMAIL: ",email, " ","PASSWORD: ", password);
  emailInfo = email;
  // Validate email and password (similar to registration)
  // ...

  const transactionData = {
    email: email,
    password: password,
  };

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (response.ok) {
      const { userId } = await response.json();
      localStorage.setItem('user', JSON.stringify(userId));
      localStorage.setItem('useremail', JSON.stringify(email));
      
      console.log('Login successful for user ID:', userId);

      ID = userId;
      
      // Perform actions after successful login
      unHideWindowCreate();
      showPortfolioVariation();

      logoutBtn.style.display = "flex";

        logInRightBtn.style.display = "none";

        

      // Pass the user ID to fetchUserPortfolio
    //  await fetchUserPortfolio(userId);

    } else {
      console.error('Login failed:', response.statusText);
      // Handle login failure, show user a message, etc.

      alert ("Uncorrect Password OR Email")
    }
  } catch (error) {
    console.error('Error during login:', error);
    // Handle error, show user a message, etc.
  }
}

const loginBtn = document.getElementById('loginBtn');

loginBtn.addEventListener('click', async () => {
  try {
    await logIn();

    displayUserInfo(ID);
  } catch (error) {
    console.error('Error fetching group data:', error);
    // Handle error, show user a message, etc.
  }

});




// Function to display user information in the header
function displayUserInfo(ID) {
  console.log("displayUserInfo: ", ID);
  const userEmailSpan = document.getElementById('user-email');

  console.log("ID.email: ", emailInfo);
  userEmailSpan.textContent = emailInfo;
}

const logoutBtn = document.getElementById('button logout');
  logoutBtn.addEventListener('click',  () => {
   logoutUser();
  });

  const logInRightBtn = document.getElementById('button login');
  logInRightBtn.addEventListener('click',  () => {

    hideWindowCreate();
    
  });


// Function to log out the user
function logoutUser() {

  if (ID === 0){
    ID = 0;
    emailInfo = "";
    const userEmailSpan = document.getElementById('user-email');
  
    console.log("ID.email: ", emailInfo);
    userEmailSpan.textContent = "";
    localStorage.clear();
  
    logoutBtn.style.display = "none";

    logInRightBtn.style.display = "flex";

    window.location.reload();
    
    
    
  }

  else{
    ID = 0;
  emailInfo = "";
  const userEmailSpan = document.getElementById('user-email');

  console.log("ID.email: ", emailInfo);
  userEmailSpan.textContent = "";
  localStorage.clear();

  logoutBtn.style.display = "none";

  window.location.reload();

  }

  
}