const form  = document.getElementById('form');
const idNum = document.getElementById('idNum');
const password = document.getElementById('password')
var eyecon = document.getElementById('eyecon');

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
    error.textContent = "Please enter your ID number";
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
eyecon.onclick = () => {
    if (password.type === "password") {
        eyecon.classList.add("visible");
        eyecon.classList.remove("nonvisible");
        password.type = "text";
    } else {
        eyecon.classList.add("nonvisible");
        eyecon.classList.remove("visible");
        password.type = "password";
    }
  }

