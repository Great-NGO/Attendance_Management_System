require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AdminClass } = require('../services/adminService');
const StudentClass = require('../services/studentService').StudentClass;
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');
const { sendLoginDetailsMail } = require('../utils/sendMail');

const studentSignup = async (req, res) => {
    try {
        const {firstname, lastname, idNum, password, role, email, level, department} = req.body;

        // Create new instance of StudentClass (an object)
        let studentObject = new StudentClass(idNum, firstname, lastname, password, role, email, department, level)
        log("Student Object ", studentObject)
        const fullName = studentObject.getUserFullName()
       
        // use getByIdNum() and getByEmail() inherited from User class to check if any user (lecturer, student or admin) exists with that id
        const studentExist1 = await studentObject.getByIdNum(idNum);
        const studentExist2 = await studentObject.getByEmail(email)

        // console.log("StudentExist 1 ", studentExist1)
        // console.log("StudentExist 2 ", studentExist2)

        if(studentExist1[0] !== true && studentExist2[0] !== true) {
               
            // Use the register() method from the new instantiated object to create a new student collection (save to our database).
            const newStudent = await studentObject.register();
            success("Student saved in the database", newStudent)

            if(newStudent[0] !== false) {
                const mail = await sendLoginDetailsMail(email, fullName, idNum, password, role )       //To send email to student
                console.log("MAIL --",  mail)
                if(mail[0] == true) {
                    handleSuccessResponse(res, "Student added successfully.", 201, { info: "Email sent to student"})
                } else{
                    // handleErrorResponse(res, "Failed to send login details mail to student ", 400)
                    handleSuccessResponse(res, "Student added successfully", 200, {info: "Failed to send mail to student"} )
                }
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

const studentById = async (req, res) => {
    const { studentId } =  req.params;
    const studentObject = new StudentClass()    //New Instance of Student class
    const student = await studentObject.getById(studentId)
    if(student[0]==true) {
        let foundStudent = student[1];
        foundStudent.password = undefined;
        handleSuccessResponse(res, `Student with id Found`, 200, {student:foundStudent} )
    } else {
        handleErrorResponse(res, `Student with id '${studentId}' not found`, 404)
    }
}

const studentsByDepartment = async (req, res) => {
    const { department } = req.params;
    const students = await AdminClass.getStudentsByDept(department);    //Only an Admin or a Lecturer has the getStudentByDept method
    if(students[0]==true){
        handleSuccessResponse(res, `All Students in '${department}' department`, 200, {students:students[1], num:students[1].length})
    } else {
        handleErrorResponse(res, `No Student in '${department}' department`, 404)
    }
}

const studentsByLevel = async (req, res) => {
    const { level } = req.params;
    const students = await AdminClass.getStudentsByLevel(level);
    if(students[0]==true){
        handleSuccessResponse(res, `All Students in ${level} level`, 200, {students:students[1], num:students[1].length})
    } else {
        handleErrorResponse(res, `No Student in ${level} level`, 404)
    }
}

const studentsByLevelAndDept = async (req, res) => {
    const { level, department } = req.params;
    const students = await AdminClass.getStudentsByLevelAndDept(level, department);
    if(students[0] == true) {
        handleSuccessResponse(res, `All Students in ${level} level '${department}' department`, 200, {students:students[1], num: students[1].length})
    } else {
        handleErrorResponse(res, `No Student in ${level} level '${department}' department`, 404)
    }
}

const getStudents = async (req, res) => {
    
    const studentObject = new StudentClass()
    const students = await studentObject.getAllStudents()
    // const students = await new StudentClass().getAllStudents();
    log("All Students -", students);
    handleSuccessResponse(res, "Students in the System", 200, {students, num: students.length})

}
 
const editStudent = async(req, res) => {
    const { studentId } = req.params;
    const { firstname, lastname, level, department } = req.body;

    const studentInstance1 = new StudentClass()
    const student = await studentInstance1.getById(studentId);
    if(student[0] == true) {
        const studentInstance2 = new StudentClass(student[1].idNum)
        const fields = {firstname, lastname, level, department}
        const updatedStudent = await studentInstance2.update(fields);
        if(updatedStudent[0] == true) {
            handleSuccessResponse(res, updatedStudent[2], 200, {student:updatedStudent[1]})
        } else{
            handleErrorResponse(res, updatedStudent[1], 400 )
        }
    } else {
        return handleErrorResponse(res, student[1], 404)
    }


}


const studentUpdatePassword = async (req, res) => {
    const { studentId } = req.params;

    const {newPassword } = req.body;

    console.log("dfg",  newPassword)
    const studentObject = new StudentClass()
    const updatedStudent = await studentObject.updatePassword(studentId, newPassword, "student")
    console.log("Updated stud", updatedStudent)
    if(updatedStudent[0] == true) {
        handleSuccessResponse(res, updatedStudent[2], 200)
    } else {
        return handleErrorResponse(res, updatedStudent[1], updatedStudent[2] )
    }

} 

const deleteStudent = async(req, res) => {
    // const { idNum } = req.params;
    const { idNum } = req.body;

    if(!idNum) {
        return handleErrorResponse(res, "Student Id number(idNum) required.", 400)
    }

    const studentObject = new StudentClass(idNum)
    console.log("Stud object -", studentObject)
    const isdeleted = await studentObject.delete();
    console.log("IS DEleted", isdeleted)
    if(isdeleted[0] == true) {
        handleSuccessResponse(res, "Student deleted successfully", 200)
    } else {
        return handleErrorResponse(res, `Failed to delete student with Id '${idNum}'.`, 400)
    }
}

module.exports = {
    studentSignup,
    getStudents,
    studentsByDepartment,
    studentsByLevel,
    studentsByLevelAndDept,
    studentById,
    editStudent,
    studentUpdatePassword,
    deleteStudent
}