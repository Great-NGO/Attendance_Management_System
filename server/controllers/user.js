require('dotenv').config();
const jwt = require('jsonwebtoken');
const { UserClass } = require('../services/User');
const StudentClass = require('../services/student').StudentClass;
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');


const lecturerOrStudentLogin = async(req, res) => {
    try {
        const {idNum, password, role } = req.body;
        console.log(req.body)
        console.log(idNum&&password&&role)
        if(!(idNum && password && role)){
            return handleErrorResponse(res, "Please enter id number, password and role.", 400)
        } else {

            const user = new UserClass(idNum, '', '','', password, role )

            const authenticatedUser = await user.authenticateUser(idNum, password, role)
            // console.log("AUTH -- ", authenticatedUser)

            if(authenticatedUser[0] !== true) {
                handleErrorResponse(res, authenticatedUser[1], 400)
            } else {

                // Token
                const authToken = authenticatedUser[2];

                // Cookie
                res.cookie('authToken', authToken, {
                    secure: process.env.NODE_ENV === "production",
                    maxAge: 1000*60*60*24,
                    httpOnly: true,
                })

                return handleSuccessResponse(res, `${authenticatedUser[1].role.toUpperCase()} Login successful`, 200, { token:authToken, user:authenticatedUser[1], role:authenticatedUser[1].role})

            }
        }

    } catch (error) {
        logError(error)
        handleErrorResponse(res, `Internal Server Error. Something went wrong, try again later`, 500)
    }   
}

const userById = async(req, res, next) => {
    
}

const logout = (req, res) => {
    res.clearCookie('authToken');
    handleSuccessResponse(res, 'Logout successful', 200)
}

module.exports = {
    // login
    lecturerOrStudentLogin,
    logout
}