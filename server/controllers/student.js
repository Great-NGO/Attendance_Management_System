require('dotenv').config();
const jwt = require('jsonwebtoken');
const { getStudentById } = require('../services/student');
const StudentClass = require('../services/student').StudentClass;
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');

const studentSignup = async (req, res) => {
    try {
        const {firstname, lastname, idNum, password, role, level, department} = req.body;

        // Use the static getStudentById method from the StudentClass to check if student with idNum and role student already exists
        let stud = await StudentClass.getStudentById(idNum);
        log("Student ", stud);

        if(stud[0] !== false) {
            // Create new instance of StudentClass (an object)
            let studentObject = new StudentClass(idNum, firstname, lastname, password, role, level, department)
            log("Student Object ", studentObject)
            
            // Use new instantiated object to create a new student collection.
            let newStudent = await StudentClass.createStudent(studentObject);
            success("Student saved in the database", newStudent)

            if(newStudent[0] !== false) {
                handleSuccessResponse(res, "Student added successfully.", 201)
            } 
            // else {
            //     handleErrorResponse(res, "Failed to add student to system.", 500)
            // }

        } else {
            handleErrorResponse(res, "Student with matric number already exists.", 403)
        }
        
    } catch (error) {
        logError(error)
        handleErrorResponse(res, 'Something went wrong! Please try again later.',500)
    }
}

module.exports = {
    studentSignup
}