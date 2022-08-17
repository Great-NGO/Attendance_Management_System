require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AdminClass } = require('../services/admin');
const { UserClass } = require('../services/student');
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');

const adminSignup = async (req, res) => {
    try {
        console.log("rEQ body ", req.body);
        const {firstname, lastname, idNum, password, role, email} = req.body;

        const admins = await AdminClass.getAllAdmins();
        console.log("Admins present -- ", admins);

        if(admins.length>0) {
            return handleErrorResponse(res, "Failed to create new admin account because an admin already exists. Contact Admin/Developer if any issue.", 403)
        }

        // Create new instance of AdminClass (an object)
        let adminObject = new AdminClass(idNum, firstname, lastname, email, password, role)
        log("Admin Object ", adminObject)
       
        // use getById() and getByEmail() inherited from User class to check if any user (lecturer, student or admin) exists with that id
        const adminExists = await adminObject.getById(idNum);

        if(adminExists[0] !== true) {
    
            // Use the register() method from the new instantiated object to create a new admin user.
            const newAdmin = await adminObject.register();
            success("Admin saved in the database", newAdmin)

            if(newAdmin[0] !== false) {
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
        handleErrorResponse(res, 'Something went wrong! Please try again later.',500)
    }
}


const adminLogin = async(req, res) => {
    
}

module.exports = {
    adminSignup
}