/** CODE TO SERVE AS AN EXAMPLE ON WORKING WITH API ENDPOINTS */
// function loginFormSubmit(event) {
//     event.preventDefault();

//     const FormData = {
//         "email": document.getElementById("fEmail").value,
//         "password": document.getElementById("fPsw").value
//     }

//     console.log(FormData);

//     const token = localStorage.getItem('token')

//     fetch('/api/login', {
//         method: "POST",
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization':  `Bearer ${token}`
//         },
//         body: JSON.stringify(FormData),

//     })
//         .then((response) => {
//             console.log(response);
//             return response.json();
//         })
//         .then((data) => {
//             console.log("The Data is: ", data)
//             if (data.status === "ok") {
//                 console.log("Login Success: ", data)
//                 document.cookie = `uid = ${data.data.id}; path=/`;
//                 window.location.replace("index.html");
//             }
//             else if (data.status !== "ok") {
//                 let loginErrorDiv = document.createElement("div");
//                 loginErrorDiv.className = "alert alert-danger";
//                 loginErrorDiv.innerText = "Invalid email/password";
//                 let loginh1 = document.querySelector("#loginh1");
//                 loginh1.insertAdjacentElement("afterend", loginErrorDiv);
//             }
//         })
//         .catch((err) => {
//             console.log("This code has an error");
//             console.log("The Error is: ", err);
//         })

// }
