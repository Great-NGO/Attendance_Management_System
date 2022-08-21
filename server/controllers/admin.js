require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AdminClass } = require('../services/admin');
const { LecturerClass } = require('../services/lecturer');
const { StudentClass } = require('../services/student');
const { UserClass } = require('../services/user');
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');

const adminSignup = async (req, res) => {
    try {

        const {firstname, lastname, idNum, password, role, email} = req.body;

        const admins = await AdminClass.getAllAdmins();
        // console.log("Admins present -- ", admins);

        if(admins.length>0) {
            return handleErrorResponse(res, "Failed to create new admin account because an admin already exists. Contact Admin/Developer if any issue.", 403)
        }

        // Create new instance of AdminClass (an object)
        let adminObject = new AdminClass(idNum, firstname, lastname, email, password, role)
        // log("Admin Object ", adminObject)
       
        // use getById() and getByEmail() inherited from User class to check if any user (lecturer, student or admin) exists with that id
        const adminExists = await adminObject.getById(idNum);

        if(adminExists[0] !== true) {
    
            // Use the register() method from the new instantiated object to create a new admin user.
            const newAdmin = await adminObject.register();
            success("Admin saved in the database", newAdmin)

            // if(newAdmin[0] !== false) {
                handleSuccessResponse(res, "System Admin created successfully.", 201)
            // } 
            // else {
            //     handleErrorResponse(res, `Failed to create admin. ${newAdmin[1]}`, 500)
            // }

        } else {
            handleErrorResponse(res, "Admin ID already exists.", 403)
        }
        
    } catch (error) {
        logError(error)
        handleErrorResponse(res, 'Something went wrong! Please try again later.',500)
    }
}


const adminLogin = async(req, res) => {
    try {
        const { idNum, password } = req.body;
        // Validate the request body
        if(!(idNum && password )){
            handleErrorResponse(res, "Login with valid ID and password", 400)
        } 
        else {
            const user = new UserClass(idNum, '', '', '', password, '');
            const foundUser = await user.authenticateUser(idNum, password, 'admin');

            if(foundUser[0] !== true) {
                handleErrorResponse(res, foundUser[1], 400)
            } else{
                // If Found user is not an admin
                if(foundUser[1].role !== "admin") {
                    return handleErrorResponse(res, "Admin not found - Incorrect id/password.", 400)
                } else {
                    // Token
                    const authToken = foundUser[2];
                    // Cookie
                    res.cookie('authToken', authToken, {
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 1000*60*60*24,  //24hours
                        httpOnly: true
                    })

                    return handleSuccessResponse(res, "ADMIN Login successful", 200, { token: authToken, user:foundUser[1], role: foundUser[1].role})
                }
            }
        }

    } catch (error) {
        logError(error)
        handleErrorResponse(res, `Internal Server Error. Something went wrong, try again later`, 500)
    }
}

const editStudent = async(req, res) => {

}

const editLecturer = async(req, res) => {

}

const deleteStudent = async(req, res) => {
    const { idNum } = req.params;

    const studentObject = new StudentClass(idNum)
    console.log("Stud object -", studentObject)
    const isdeleted = await studentObject.delete();
    console.log("IS DEleted", isdeleted)
    if(isdeleted[0] == true) {
        handleSuccessResponse(res, "Student deleted successfully", 200)
    } else {
        handleErrorResponse(res, "Failed to delete student.", 400)
    }
}

const deleteLecturer = async(req, res) => {
    const { idNum } = req.params;

    const lecturerObject = new LecturerClass(idNum)
    const isdeleted = await lecturerObject.delete();

    if(isdeleted[0] == true) {
        handleSuccessResponse(res, "Lecturer deleted successfully", 200)
    } else {
        handleErrorResponse(res, "Failed to delete lecturer.", 400)
    }
}

module.exports = {
    adminSignup,
    adminLogin,
    editStudent,
    editLecturer,
    deleteStudent,
    deleteLecturer

}