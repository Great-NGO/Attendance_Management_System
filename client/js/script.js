  var lecRad = document.querySelectorAll(".login input[value='lecturer']");
  var lecText = document.querySelector(".login .form-control input[type='text']");
  var studRad = document.querySelectorAll(".login input[value='student']");
  for (let i=0; i < lecRad.length; i++) {
    lecRad[i].onclick = function() {
    lecText.placeholder = "ID Number";
  }
  }
  for (let i=0; i < studRad.length; i++) {
    studRad[i].onclick = function() {
    lecText.placeholder = "Matric Number";
  }
  }
  const form = document.querySelector(".login");
  const idNum = document.getElementById('idNum');
  const password = document.getElementById('password')
//   const error = document.getElementsByClassName('error')

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
      idNum.focus();
        error.textContent = "Please enter your ID";
    }
    else if (passTest) {
      password.className = "invalid";
      password.focus();
      error.textContent = "Please enter your password";
      idNum.className = "valid";
    }
     else {
      idNum.className = "valid";
      password.className = "valid";
      error.textContent = "";
    }
  });