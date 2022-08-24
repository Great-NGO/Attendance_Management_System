// const basicUrl = "https://buattendancemanagementsystem.herokuapp.com/"
const basicUrl = "http://localhost:4000/"
async function adminLogin (idNum,password) {
    try {
        const response = await fetch (`${basicUrl}api/v1/admin/login`, {method: 'POST', body: JSON.stringify({
            idNum: idNum, password: password
        }) })
        const resData = await response.json()
        console.log(resData)
    } catch (error) {
        console.log(error)
    }
}

adminLogin('7dhusdjdsjh', 'hjdhjddjhf')