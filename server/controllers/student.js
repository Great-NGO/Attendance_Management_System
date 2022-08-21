require('dotenv').config();
const jwt = require('jsonwebtoken');
const StudentClass = require('../services/student').StudentClass;
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');

const studentSignup = async (req, res) => {
    try {
        const {firstname, lastname, idNum, password, role, email, level, department} = req.body;

        // Create new instance of StudentClass (an object)
        let studentObject = new StudentClass(idNum, firstname, lastname, password, role, email, department, level)
        log("Student Object ", studentObject)
       
        // use getById() and getByEmail() inherited from User class to check if any user (lecturer, student or admin) exists with that id
        const studentExist1 = await studentObject.getById(idNum);
        const studentExist2 = await studentObject.getByEmail(email)

        // console.log("StudentExist 1 ", studentExist1)
        // console.log("StudentExist 2 ", studentExist2)

        if(studentExist1[0] !== true && studentExist2[0] !== true) {
               
            // Use the register() method from the new instantiated object to create a new student collection (save to our database).
            const newStudent = await studentObject.register();
            success("Student saved in the database", newStudent)

            if(newStudent[0] !== false) {
                handleSuccessResponse(res, "Student added successfully.", 201, { info: "Email sent to student"})
            } 
            else {
                handleErrorResponse(res, `Failed to add student to system. ${newStudent[1]}`, 500)
            }

        } else {
            handleErrorResponse(res, "Student Matric number/Email already exists.", 403)
        }
        
    } catch (error) {
        logError(error)
        handleErrorResponse(res, 'Something went wrong! Please try again later.',500)
    }
}


module.exports = {
    studentSignup
}