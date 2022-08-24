require('dotenv').config();
const { AdminClass } = require('../services/adminService');
const { CourseClass } = require("../services/courseService");
const { LecturerClass } = require('../services/lecturerService');
const { UserClass } = require('../services/userService');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');



const createCourse = async (req, res) => {

    try {
        const { lecturer, courseDepartment, staffId, courseTitle, courseCode } = req.body;

        const lecturerExists = await LecturerClass.getLecturerByStaffId(staffId)

        if (lecturerExists[0] !== true) {
            return handleErrorResponse(res, "Staff ID entered does not belong to any Lecturer.", 400)
        }

        const courseExists = await new CourseClass().getByCourseCode(courseCode);
        console.log("Course Exists ", courseExists);
        if (courseExists[0] == true) {
            return handleErrorResponse(res, `Course - '${courseCode}' already exists`, 400)
        }

        const taughtBy = {
            lecturerId: lecturerExists[1]._id,
            lecturerName: `${lecturerExists[1].firstname} ${lecturerExists[1].lastname}`,
            staffId
        }

        const courseObject = new CourseClass(taughtBy, courseTitle, courseCode, courseDepartment)
        console.log("Coursee -- ", courseObject);

        const newCourse = await courseObject.add();
        console.log("NEw course -- ", newCourse)

        if (newCourse[0] == true) {
            handleSuccessResponse(res, "New Course created successfully.", 200, { course: newCourse[1] })
        } else {
            return handleErrorResponse(res, "Failed to create course.", 400)
        }

    } catch (error) {
        return handleErrorResponse(res, "Something went wrong. Failed to add course, please try again later!", 500)
    }

}

const getLecturerCourses = async (req, res) => {
 
    // const lecturerId = req.user.user_id;
    let lecturerId;
    req.role == "lecturer" ? lecturerId = req.user.user_id : lecturerId = req.params.lecturerId
    // console.log("Lecturer id ", lecturerId);

    const courseObject = new CourseClass()
    const lecturerCourses = await courseObject.getCoursesByLecturer(lecturerId);
    console.log("Lecturer courses ", lecturerCourses);
    if (lecturerCourses[0] == true) {
        handleSuccessResponse(res, "List of Lecturer courses", 200, { courses: lecturerCourses[1] })
    } else {
        handleErrorResponse(res, "No course assigned to lecturer", 404)
    }

}

const getAllCourses = async(req, res) => {
    // Instantiating the AdminClass() because the getAllCourses() method which queries our database is defined on that class
    const courses = await new AdminClass().getAllCourses()
    console.log("COurses -", courses);
    handleSuccessResponse(res, "All Courses in the System", 200, {courses})
}

// const coursesByLecturer = async (req, res) => {
//     const { lecturerId } = req.params;
//     let lecturer;

// }

const editCourse = async (req, res) => {

}

const deleteCourse = async (req, res) => {

}

const addStudentToCourse = async (req, res) => {
    
    const { studentId, studentName, studentMatricNo, studentLevel } = req.body;

    let takenBy = [];

    const obj = {
        studentId,
        studentName,
        studentMatricNo,
        studentLevel
    }

    

}

module.exports = {
    createCourse,
    editCourse,
    deleteCourse,
    getAllCourses,
    getLecturerCourses,
    addStudentToCourse
}
