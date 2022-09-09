/** ALL GENERAL JAVASCRIPT CODE FOR THE (/) route HERE */

// import { setWithExpiry } from "./modules/auth.js";
import { setWithExpiry, getCurrentUser } from "./modules/auth.js";

const path = window.location.href;

console.log("Path", path);

/** STUDENT/LECTURER LOGIN (landing page/index page) */
if (path[path.length - 1] == "/" || path.match(/index.html/i)) {
  let errorDiv = document.querySelector(".login-form #error");
  let selectStudents = document.querySelectorAll("div.student");    //We have two divs with class student which are used to select role as student
  let selectLecturers = document.querySelectorAll("div.lecturer");   //We have two divs with class lecturer which are used to select role as lecturer
  let placeholderText = document.querySelector(
    ".login .form-control input[type='text']"
  );
  let role;

  // For Students
  selectStudents.forEach((selectStudent) => {
    selectStudent.addEventListener("click", (evt) => {
      placeholderText.placeholder = "Matric Number";
      // selectStudent.children.role.setAttribute('checked', '');
      selectStudent.children.role.checked = true;
      role = "student";
    });
  });

  // For Lecturers
  selectLecturers.forEach((selectLecturer) => {
    selectLecturer.addEventListener("click", (evt) => {
      placeholderText.placeholder = "Staff ID";
      // selectLecturer.children.role.checked = true;
      selectLecturer.children.role.setAttribute("checked", "");
      role = "lecturer";
    });
  });

  const form = document.querySelector(".login");
  const idNum = document.getElementById("idNum");
  const password = document.getElementById("password");

  // To clear error div when typing id num or password
  idNum.addEventListener("input", (evt) => {
    errorDiv.innerHTML = "";
  });

  password.addEventListener("input", (evt) => {
    // console.log("Password ", password.value)
    errorDiv.innerHTML = "";
  });

  // This defines what happens when the user tries to submit the data
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = {
      idNum: idNum.value,
      password: password.value,
      role,
    };

    fetch("/api/v1/login", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("The data ", data);
        if (data.error) {
          console.log("DAta error - ", data.error);
          errorDiv.innerHTML = data.error;
        } else {
          errorDiv.innerHTML = "";
          setWithExpiry("user", data.data.user, data.data.token);
          // alert("Log in successful");
          
          // Get user role from response. If user is a student redirect them to student view else redirect them to lecturer view
          const { role } = data.data.user;
          if(role === "student") {
            window.location.replace("/student")
          } else {
            window.location.replace("/lecturer")

          }
        }
      })
      .catch((err) => {
        console.log("Error ", err);
        errorDiv.innerHTML = err.error;
      });
  });
}

/** FORGOT PASSWORD */
if (path.match(/forgot-password.html/i)) {
  const forgotPswdEmail = document.getElementById("email");
  const role = document.querySelector("select.role#role");

  let successMsg = document.querySelector(".fPSuccess");

  console.log("Role value ", role);

  const form = document.querySelector("form");
  let errorDiv = document.querySelector("#form #error");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = {
      email: forgotPswdEmail.value,
      role: role.value,
    };

    fetch("/api/v1/forgotPassword", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("The data ", data);
        if (data.error) {
          console.log("DAta error - ", data.error);
          errorDiv.innerHTML = data.error;
          successMsg.innerHTML = ""; //Remove success message if any if there is an error
        } else {
          console.log("The data ", data);

          errorDiv.innerHTML = ""; //Clear error message
          successMsg.style.backgroundColor = "#00fff7";
          successMsg.style.padding = "3%";
          successMsg.innerHTML = `
            <strong> <small>${data.message}</small> </strong>
          `;
        }
      })
      .catch((err) => {
        console.log("Error ", err);
        errorDiv.innerHTML = err.error;
      });
  });
}

/** RESET PASSWORD */
if (path.match(/reset-password.html/i)) {

  const form = document.getElementById("form");
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirm");
  let eyecon = document.getElementById("eyecon");
  let eyecon2 = document.getElementById("eyecon-2");
  let errorDiv = document.querySelector("#form #error");
  let successMsg = document.querySelector(".rPSuccess");

  // To toggle visibility icon on form input
  // For New Password
  eyecon.addEventListener("click", (evt) => {
    if (password.type === "password") {
      eyecon.classList.add("visible");
      eyecon.classList.remove("nonvisible");
      password.type = "text";
  } else {
      eyecon.classList.add("nonvisible");
      eyecon.classList.remove("visible");
      password.type = "password";
  }
  })

  // For Confirm Password
  eyecon2.addEventListener("click", (evt) => {
    if (confirm.type === "password") {
      eyecon2.classList.add("visible");
      eyecon2.classList.remove("nonvisible");
      confirm.type = "text";
  } else {
      eyecon2.classList.add("nonvisible");
      eyecon2.classList.remove("visible");
      confirm.type = "password";
  }
  })

  // On Submit
  form.addEventListener("submit", (evt) => {
    evt.preventDefault();

    const urlString = document.URL;     //Returns the full url of the document
    const url = new URL(urlString);
    const searchParam = url.searchParams;
    const id = searchParam.get("id");
  
    console.log("The id ", id)

    const formData = {
      newPassword: password.value,
      confirmPassword: confirm.value
    }
    
    fetch(`/api/v1/reset/password/${id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("The data ", data);
        if (data.error) {
          console.log("DAta error - ", data.error);
          //error is the html element - small with an id of error. (Same as errorDiv)
          error.innerHTML = data.error;
          successMsg.innerHTML = ""; //Remove success message if any if there is an error
        } else {
          console.log("The data ", data);

          errorDiv.innerHTML = ""; //Clear error message
          successMsg.style.backgroundColor = "#00fff7";
          successMsg.style.padding = "4%";
          successMsg.innerHTML = `
            <strong> <small>Password has been reset successfully.</small> </strong>
          `;
        }
      })
      .catch((err) => {
        console.log("Error ", err);
        errorDiv.innerHTML = err.error;
      });

  })

}

/** Would use window on load to check if user is logged in or not */
window.addEventListener("load", () => {

  if(getCurrentUser()) {
    console.log("User logged in")
  } else {
    console.log("User logged out")

  }
})
