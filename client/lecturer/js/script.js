/** ALL JAVASCRIPT CODE FOR THE (/lecturer) route goes here*/

const basicUrl = 'http://localhost:4000/api/v1/'
const conDiv = document.getElementById('courses')
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];



// const user = localStorage.getItem("user");
const user = JSON.parse(localStorage.getItem("user"));
console.log("The user ", user)

if (!user) {
    alert("No to");
    // window.location = 'http://localhost:4000/auth/sign-in.html'
} else if(user.value.role !== "lecturer") {
    alert("Unauthorized");
}

// const token = JSON.parse(user).token;
const token = user.token;
console.log("The token ", token)

const lecturerName = `${user.value.firstname} ${user.value.lastname}` 

async function viewcourses() {
    try {
        const response = await fetch(`${basicUrl}lecturer/get/courses`, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        })
        const resdata = await response.json()
        console.log(resdata)
        for (let course of resdata.data.courses) {
            const div = renderCourse(course.courseTitle, course.courseCode, lecturerName, course.courseDepartment)
            conDiv.appendChild(div)
        }


    } catch (error) {
        console.log(error)
    }
}
function renderCourse(courseTitle, courseCode, lecturerName, courseDepartment) {
    const div = document.createElement('div')
    div.innerHTML = `<div class="card"><div class="row"><h5 class="header">${courseTitle}</h5><p>${courseCode}</p></div><p>Department: ${courseDepartment}</p <p>Taught by ${lecturerName}</p><button class="btn">Add Student</button></div>`
    return div
}
viewcourses().then(()=> {
    const btns = document.getElementsByClassName("btn");
    for (let btn of btns) {
        btn.addEventListener('click', function (e) {
            console.log(e)
            modal.style.display = "block";
        })
    }
})




// Get the <span> element that closes the modal



// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
