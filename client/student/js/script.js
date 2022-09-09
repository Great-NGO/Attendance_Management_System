/** For Submitting attendance and viewing profile */
import { getCurrentUser } from "../../js/modules/auth.js";

let isAuthorized = getCurrentUser();

if (!isAuthorized) {
  console.log("Unauthorized");
  alert("Unauthorized");
  window.location.replace("/");
}

async function getWebCam() {
  try {
    const videoSrc = await navigator.mediaDevices.getUserMedia({ video: true });
    var video = document.getElementById("video");
    video.srcObject = videoSrc;
  } catch (e) {
    console.log(e);
  }
}

var capture = document.getElementById("capture");
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

capture.addEventListener("click", function () {
  context.drawImage(video, 0, 0, 600, 480);
});

let next = document.querySelector("button.btn2.submitAttendanceBtn");
// function next() {

next.addEventListener("click", (evt) => {
  // Using Canvas - canvas.toDataURL("type/format", "quality - no between 0 and 1")
  let studentPicture = canvas.toDataURL("image/jpeg", 0.5);
  console.log("Canvas - Student picture ", studentPicture);

  let form = new FormData();
  form.append("courseCode", "Test101");
  form.append("latitude", "15.401");
  form.append("longitude", "12");
  form.append("picture", studentPicture);

  console.log("The form data ", form);

  let token = getCurrentUser().token;

  fetch("/api/v1/student/course/submitAttendance", {
    method: "POST",
    headers: {
      // 'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    body: form,
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log("The Data is: ", data);

      if (data.error) {
        if (data.error == "User Session has expired.") {
          console.log("Session expired");
          alert("Student session has expired, please login again");
          window.location.replace("/");
        } else {
          alert(data.error);
        }
      } else {
        alert("Attendance capture successfully.");
        // document.getElementById('anchor').setAttribute("href","CapturePage.html");
      }
    })
    .catch((err) => {
      console.log("This code has an error");
      console.log("The Error is: ", err);
    });
});

getWebCam();

var d = new Date();
var DoW = [
  "sunday",
  "monday",
  " tuesday",
  " wednesday",
  " thursday",
  "friday",
  "saturday",
];
var day = DoW[d.getDay()];
var date = d.getDate();
var MoY = [
  " january",
  "febuary",
  "march",
  "april",
  "may",
  "June",
  "july",
  "august",
  "september",
  "october",
  "november" + "december",
];
var month = MoY[d.getMonth()];
var year = d.getFullYear();
document.getElementById("today").innerHTML =
  day + " " + date + ", " + month + " " + year;

let clock = document.getElementById("time");
setInterval(function () {
  let date = new Date();
  clock.innerHTML = date.toLocaleTimeString();
}, 1000);

/** FOR Location capturing */
const getLocation = document.getElementById("getlocation");
getLocation.addEventListener("click", (evt) => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        console.log(latitude, longitude);
      },
      (error) => {
        console.log(error.code);
      }
    );
  } else {
    console.log("Not Supported");
  }
});
