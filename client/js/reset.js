const form  = document.getElementById('form');
const password = document.getElementById('password');
const confirm = document.getElementById('confirm')
var eyecon = document.getElementById('eyecon');
var eyecon2 = document.getElementById('eyecon-2');


window.addEventListener("load", () => {
  // Here, we test if the field is empty
  const test = password.value.length === 0;
  password.className = test ? "valid" : "invalid";
});

// This defines what happens when the user tries to submit the data
form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const confirmTest = confirm.value === password.value;
  const passTest = password.value.length === 0;

  if (passTest) {
    password.className = "invalid";
    password.focus();
    error.textContent = "Please enter your password";
  }
  else if (!confirmTest) {
    confirm.className = "invalid";
    confirm.focus();
    error.textContent = "Your password and confirm password do not match";
    password.className = "valid";
  }
   else {
    confirm.className = "valid";
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
eyecon2.onclick = () => {
    if (confirm.type === "password") {
        eyecon2.classList.add("visible");
        eyecon2.classList.remove("nonvisible");
        confirm.type = "text";
    } else {
        eyecon2.classList.add("nonvisible");
        eyecon2.classList.remove("visible");
        confirm.type = "password";
    }
  }