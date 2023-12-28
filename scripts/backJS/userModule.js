// userModule.js
let userId = 0;

function setUserId(newUserId) {
  userId = newUserId;
}

function getUserId() {
  return userId;
}

// Use the export keyword to export the functions
export { setUserId, getUserId };