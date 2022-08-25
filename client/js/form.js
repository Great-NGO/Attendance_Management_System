const email = document.getElementById('email');

const emailRegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

window.addEventListener("load", () => {
  // Here, we test if the field is empty
  // If it is not, we check if its content is a well-formed e-mail address.
  const test = email.value.length === 0 || emailRegExp.test(email.value);

  email.className = test ? "valid" : "invalid";
});

// This defines what happens when the user tries to submit the data
form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  const mailTest = email.value.length === 0;
  const mailReg = emailRegExp.test(email.value);
  console.log(mailReg)
  //check if mail meets empty test
  if (mailTest) {
    console.log("Jester's Priviledge")
    email.className = "invalid";
    email.focus();
    error.textContent = "Please enter your Email Address";
  }
  //check if mail meets regEx test
  else if (!mailReg) {
    email.className = "invalid";
    email.focus();
    error.textContent = "Please enter a valid Email Address format";
  }
   else {
    email.className = "valid;"
    error.textContent = "";
  }
});