require('dotenv').config();
const { AdminClass } = require('../services/adminService');
const { CourseClass } = require('../services/courseService');
const { StudentClass } = require('../services/studentService');
const { UserClass } = require('../services/userService');
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');


const getDepartments = (req, res) => {
    const departments = CourseClass.getDepartments()
    handleSuccessResponse(res, "", 200, {departments, num: departments.length})
}


module.exports = {

    getDepartments
}