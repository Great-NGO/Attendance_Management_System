require('dotenv').config();
const jwt = require('jsonwebtoken');
const { LecturerClass} = require('../services/lecturer');
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');

const lecturerSignup = async (req, res) => {
    try {
        const {firstname, lastname, idNum, password, role, email, department} = req.body;

        // Create new instance of LecturerClass (an object)
        let lecturerObject = new LecturerClass(idNum, firstname, lastname, password, role, email, department)
        log("Lecturer Object ", lecturerObject)

        const lecturerExist1 = await lecturerObject.getById(idNum)
        const lecturerExist2 = await lecturerObject.getByEmail(email)

        // console.log("LEcturer exist 1", lecturerExist1)
        // console.log("LEcturer exist 2", lecturerExist2)

        if(lecturerExist1[0] !== true && lecturerExist2[0] !== true) {
            lecturerObject.getUserFullName();
            lecturerObject.login(idNum, password, role)
            
            // Use the register() method from the new instantiated object to create a new lecturer.
            const newLecturer = await lecturerObject.register();
            success("Lecturer saved in the database", newLecturer)

            if(newLecturer[0] !== false) {
                handleSuccessResponse(res, "Lecturer added successfully.", 201, { info: "Email sent to lecturer"})
            } 
            else {
                handleErrorResponse(res, `Failed to add lecturer to system. ${newLecturer[1]}`, 500)
            }

        } else {
            handleErrorResponse(res, "Staff ID/Email already exists.", 403)
        }
        
    } catch (error) {
        logError(error)
        handleErrorResponse(res, 'Something went wrong! Please try again later.',500)
    }
}

module.exports = {
    lecturerSignup
}