

const btn = document.getElementById("btn")
const password = document.getElementById("password")
const role = document.getElementById("role")
const idNum = document.getElementById("idNum")
const basicUrl = 'http://localhost:4000/api/v1/'
// const form = document.getElementsByTagName('form')
// form[0].addEventListener('submit', login)

idNum.addEventListener('change', validateForm)
password.addEventListener('change', validateForm)

btn.addEventListener("click",login)
async function login(e) {
    try {
        e.preventDefault()
        if (role.value === 'lecturer'){
            const response = await fetch(`${basicUrl}login`, { method: "POST", body: JSON.stringify({ idNum: idNum.value, password: password.value, role: role.value }), headers: {
                'Content-Type': 'application/json'
            } })
            const resdata = await response.json()
            console.log(resdata)
            if (resdata.success){
                const token = resdata.data.token
                const user = resdata.data.user
                localStorage.setItem('token', token)
                localStorage.setItem('user', JSON.stringify(user))
                window.location = `http://localhost:4000/${resdata.data.role}/dashboard.html`
    
            }
        }
        
    } catch (error) {
        console.log(error)
    }
}

function validateForm (){
    let isValid = false
    isValid = idNum.value && password.value
    console.log(isValid, 'kfdkjfd')
    btn.disabled = !isValid
}