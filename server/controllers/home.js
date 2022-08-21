require('dotenv').config();
const { AdminClass } = require('../services/admin');
const { CourseClass } = require('../services/course');
const { StudentClass } = require('../services/student');
const { UserClass } = require('../services/user');
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');

const getLecturers = async (req, res) => {
    
    const lecturers = await AdminClass.getAllLecturers()
    log("All Lecturers -",lecturers);
    handleSuccessResponse(res, "", 200, {lecturers, num:lecturers.length})

}

const getStudents = async (req, res) => {
    
    const students = await AdminClass.getAllStudents()
    log("All Students -", students);
    handleSuccessResponse(res, "Students in the System", 200, {students, num: students.length})

}

const getDepartments = (req, res) => {
    const departments = CourseClass.getCourses()
    handleSuccessResponse(res, "", 200, {departments, num: departments.length})
}




module.exports = {
    getLecturers,
    getStudents, 
    getDepartments
}