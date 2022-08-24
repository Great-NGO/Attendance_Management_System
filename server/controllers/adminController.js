require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AdminClass } = require('../services/adminService');
const { LecturerClass } = require('../services/lecturerService');
const { StudentClass } = require('../services/studentService');
const { UserClass } = require('../services/userService');
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');
const { sendResetPwdMail } = require('../utils/sendMail');

const adminSignup = async (req, res) => {
    try {

        const { firstname, lastname, idNum, password, role, email } = req.body;

        const admins = await AdminClass.getAllAdmins();
        // console.log("Admins present -- ", admins);

        if (admins.length > 0) {
            return handleErrorResponse(res, "Failed to create new admin account because an admin already exists. Contact Admin/Developer if any issue.", 403)
        }

        // Create new instance of AdminClass (an object)
        let adminObject = new AdminClass(idNum, firstname, lastname, email, password, role)
        // log("Admin Object ", adminObject)

        // use getByIdNum() and getByEmail() inherited from User class to check if any user (lecturer, student or admin) exists with that id
        const adminExists = await adminObject.getByIdNum(idNum);

        if (adminExists[0] !== true) {

            // Use the register() method from the new instantiated object to create a new admin user.
            const newAdmin = await adminObject.register();
            success("Admin saved in the database", newAdmin)

            if (newAdmin[0] !== false) {
                handleSuccessResponse(res, "System Admin created successfully.", 201)
            }
            else {
                handleErrorResponse(res, `Failed to create admin. ${newAdmin[1]}`, 500)
            }

        } else {
            handleErrorResponse(res, "Admin ID already exists.", 403)
        }

    } catch (error) {
        logError(error)
        handleErrorResponse(res, 'Something went wrong! Please try again later.', 500)
    }
}


const adminLogin = async (req, res) => {
    try {
        const { idNum, password } = req.body;
        // Validate the request body
        if (!(idNum && password)) {
            handleErrorResponse(res, "Login with valid ID and password", 400)
        }
        else {
            const user = new UserClass(idNum, '', '', '', password, '');
            const foundUser = await user.authenticateUser(idNum, password, 'admin');

            if (foundUser[0] !== true) {
                handleErrorResponse(res, foundUser[1], 400)
            } else {
                // If Found user is not an admin
                if (foundUser[1].role !== "admin") {
                    return handleErrorResponse(res, "Admin not found - Incorrect id/password.", 400)
                } else {
                    // Token
                    const authToken = foundUser[2];
                    // Cookie
                    res.cookie('authToken', authToken, {
                        secure: process.env.NODE_ENV === "production",
                        maxAge: 1000 * 60 * 60 * 24,  //24hours
                        httpOnly: true
                    })

                    return handleSuccessResponse(res, "ADMIN Login successful", 200, { token: authToken, user: foundUser[1], role: foundUser[1].role })
                }
            }
        }

    } catch (error) {
        logError(error)
        handleErrorResponse(res, `Internal Server Error. Something went wrong, try again later`, 500)
    }
}

const adminById = async (req, res) => {
    const id = req.user.user_id;

    const admin = await new AdminClass().getById(id)
    if (admin[0] == true) {
        handleSuccessResponse(res, "Admin with Id found", 200, { admin: admin[1] })
    } else {
        handleErrorResponse(res, "Admin not found", 404)
    }
}

const adminUpdatePassword = async (req, res) => {
    const adminId = req.user.user_id;
    const { newPassword } = req.body;
    const updatedAdmin = await new AdminClass().updatePassword(adminId, newPassword, "admin");
    if (updatedAdmin[0] == true) {
        handleSuccessResponse(res, updatedAdmin[1], 200)
    } else {
        return handleErrorResponse(res, updatedAdmin[1], updatedAdmin[2])
    }

}

const deleteAdmin = async (req, res) => {

    const idNum = req.user.idNum;
    const adminObject = new AdminClass(idNum);
    const isdeleted = await adminObject.delete();
    if (isdeleted[0] == true) {

        res.clearCookie('authToken')
        return handleSuccessResponse(res, "Admin Account deleted Successfully.", 200, { additionalInfo: "Clear cookie and token and redirect admin" })

    } else {
        return handleErrorResponse(res, "Failed to delete admin", 400)
    }

}

const adminForgotPassword = async (req, res) => {
    // console.log("REq body ", req.body)

    const { email, role } = req.body;
    const foundAdmin = await new AdminClass().getByEmail(email);
    console.log(foundAdmin)
    if (foundAdmin[0] == true) {
        if (foundAdmin[1].role == role) {
            // // Destructuring required elements
            const { idNum, firstname, lastname } = foundAdmin[1];
            // creating new instance of class to use the getUserFullName method
            const fullName = new AdminClass(idNum, firstname, lastname, email, '', role).getUserFullName()
            const sendMail = await sendResetPwdMail(email, fullName, foundAdmin[1]._id, role)
            if(sendMail[0] !== false) {
                handleSuccessResponse(res, "A reset password link has been sent to your email", 200)
            } else {
                return handleErrorResponse(res, "Something went wrong - Failed to send reset password link.", 500)
            }
            // handleSuccessResponse(res, "A reset password link has been sent to your email", 200)

        } else {
            return handleErrorResponse(res, `No ${role.charAt(0).toUpperCase() + role.slice(1)} with email found`, 404)
        }
    } else {
        return handleErrorResponse(res, "Account does not exist. ", 404)
    }

}

const adminResetPassword = async (req, res) => {
    const { id } = req.params;
    const { newPassword } = req.body;

    // Create a new Admin class instance 
    const adminObject = new AdminClass()
    // Call the asynchronous getById() method (with await keyword) to find the admin
    const foundUser = await adminObject.getById(id)
    if (foundUser[0] !== false) {
        // If the found user is not an admin
        if (foundUser[1].role !== "admin") {
            return handleErrorResponse(res, 'Not an Admin User', 404)
        } else {
            const updatedAdmin = await adminObject.updatePassword(id, newPassword, foundUser[1].role)
            if (updatedAdmin[0] == true) {
                handleSuccessResponse(res, updatedAdmin[2], 200)
            } else {
                return handleErrorResponse(res, updatedAdmin[1], updatedAdmin[2])
            }
        }

    } else {
        return handleErrorResponse(res, 'Account not found ', 404)
    }

}



module.exports = {
    adminSignup,
    adminLogin,
    adminById,
    adminUpdatePassword,
    deleteAdmin,
    adminForgotPassword,
    adminResetPassword

}