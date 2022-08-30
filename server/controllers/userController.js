require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UserClass } = require('../services/userService');
const { StudentClass } = require('../services/studentService');
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');
const { sendResetPwdMail } = require('../utils/sendMail');


const lecturerOrStudentLogin = async (req, res) => {
    try {
        const { idNum, password, role } = req.body;
        console.log(req.body)
        console.log(idNum && password && role)
        if (!(idNum && password && role)) {
            return handleErrorResponse(res, "Please enter id number, password and select role.", 400)
        } else {

            const user = new UserClass(idNum, '', '', '', password, role)

            const authenticatedUser = await user.authenticateUser(idNum, password, role)
            // console.log("AUTH -- ", authenticatedUser)

            if (authenticatedUser[0] !== true) {
                handleErrorResponse(res, authenticatedUser[1], 400)
            } else {

                // Token
                const authToken = authenticatedUser[2];

                // Cookie
                res.cookie('authToken', authToken, {
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 1000 * 60 * 60 * 24,
                    httpOnly: true,
                })

                return handleSuccessResponse(res, `${authenticatedUser[1].role.toUpperCase()} Login successful`, 200, { token: authToken, user: authenticatedUser[1], role: authenticatedUser[1].role })

            }
        }

    } catch (error) {
        logError(error)
        handleErrorResponse(res, `Internal Server Error. Something went wrong, try again later`, 500)
    }
}

const logout = (req, res) => {
    res.clearCookie('authToken');
    handleSuccessResponse(res, 'Logout successful', 200)
}

const forgotPassword = async (req, res) => {
    console.log("REq body ", req.body)

    const { email, role } = req.body;
    const foundUser = await new UserClass().getByEmail(email);
    console.log(foundUser)
    if (foundUser[0] == true) {
        if (foundUser[1].role == role) {
            // // Destructuring required elements
            const { idNum, firstname, lastname } = foundUser[1];
            // creating new instance of class to use the getUserFullName method
            const fullName = new UserClass(idNum, firstname, lastname, email, '', role).getUserFullName()
            const sendMail = await sendResetPwdMail(email, fullName, foundUser[1]._id, role)
            if(sendMail[0] !== false) {
                handleSuccessResponse(res, "A reset password link has been sent to your email", 200)
            } else {
                handleErrorResponse(res, "Something went wrong - Failed to send reset password link.", 500)
            }
            // handleSuccessResponse(res, "A reset password link has been sent to your email", 200)

        } else {
            handleErrorResponse(res, `No ${role.charAt(0).toUpperCase() + role.slice(1)} with email found`, 404)
        }
    } else {
        handleErrorResponse(res, "Account does not exist. ", 404)
    }

}

const resetPassword = async (req, res) => {
    const { id } = req.params;

    const { newPassword } = req.body;

    // Create a new User class instance 
    const userObject = new UserClass()
    // Call the asynchronous getById() method (with await keyword) to find the user
    const foundUser = await userObject.getById(id)
    if(foundUser[0] !== false) {
        const updatedUser = await userObject.updatePassword(id, newPassword, foundUser[1].role)
        if (updatedUser[0] == true) {
            handleSuccessResponse(res, updatedUser[2], 200)
        } else {
            return handleErrorResponse(res, updatedUser[1], updatedUser[2])
        }
    } else {
        return handleErrorResponse(res, 'Account not found ', 404)
    }
 

}

module.exports = {
    lecturerOrStudentLogin,
    logout,
    forgotPassword,
    resetPassword
}