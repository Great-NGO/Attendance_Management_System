const form  = document.getElementById('form');
const idNum = document.getElementById('idNum');
const password = document.getElementById('password')

window.addEventListener("load", () => {
  // Here, we test if the field is empty
  const test = idNum.value.length === 0;

  idNum.className = test ? "valid" : "invalid";
});

// This defines what happens when the user tries to submit the data
form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const idTest = idNum.value.length === 0;
  const passTest = password.value.length === 0;
  if (idTest) {
    idNum.className = "invalid";
    error.textContent = "Please enter your ID number";
  }
  else if (passTest) {
    password.className = "invalid";
    error.textContent = "Please enter your password";
    idNum.className = "valid";
  }
   else {
    idNum.className = "valid";
    password.className = "valid";
    error.textContent = "";
  }
});
