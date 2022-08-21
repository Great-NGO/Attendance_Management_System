require('dotenv').config();
const jwt = require("jsonwebtoken");
const { logError } = require('../utils/logging');
const { handleErrorResponse } = require('../utils/responseHandler');

const requireSignin = async(req, res, next) => {
    const header = req.headers.authorization
    const token = header&&header.split(" ")[1] || req.cookies.authToken;

    if(!token){
        return handleErrorResponse(res, "Cannot access this route because a token is required for authentication.", 403);
    } else {
        try {
            console.log("AAAAA");
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("DECODED - ", decoded)            
    
            const { id, user_id, role, exp } = decoded;
    
            console.log("Is token expired ", exp > Date.now())
    
            const user = { idNum:id, role, user_id}
            req.user = user;
            return next();
    
        } catch(err) {
            logError('Error in decoding token', err);
            console.log(err.name)

            if(err.name === "TokenExpiredError") {
                return handleErrorResponse(res, "User Session has expired.", 401)

            } else {
                return handleErrorResponse(res, "Failed to validate user token" ,500)

            }
        }
    }

    // return next();
}

const verifyStudent = async (req, res, next) => {

}

const verifyLecturer = async (req, res, next) => {

}

const isAdmin = async(req, res, next) => {
    if(req.user.role !== "admin") {
        return handleErrorResponse(res, "Can not access this route. Not an admin", 403)
    } else {
        return next()
    }
}

const isLecturer = async(req, res, next) => {
    if(req.user.role !== "lecturer") {
        return handleErrorResponse(res, "Can not access this route. Not a lecturer.", 403)
    } else {
        return next()
    }
}

const isStudent = async(req, res, next) => {
    if(req.user.role !== "student") {
        return handleErrorResponse(res, "Can not access this route. Not a student.", 403)
    } else {
        return next()
    }
}

const verifyAdminOrLecturer = async(req, res, next) => {
    if(req.user.role !== "admin" || req.user.role !== "lecturer") {
        return handleErrorResponse(res, "Can not access this route. Not an admin or a lecturer.", 403)
    } else {
        return next()
    }
}

module.exports = {
    isAdmin,
    isLecturer,
    isStudent,
    requireSignin,
    verifyAdminOrLecturer
}