require('dotenv').config();
const { AdminClass } = require('../services/adminService');
const { CourseClass } = require("../services/courseService");
const { LecturerClass } = require('../services/lecturerService');
const { StudentClass } = require('../services/studentService');
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
    req.user.role == "lecturer" ? lecturerId = req.user.user_id : lecturerId = req.params.lecturerId
    console.log("Lecturer id ", lecturerId);

    const courseObject = new CourseClass()
    const lecturerCourses = await courseObject.getCoursesByLecturer(lecturerId);
    console.log("Lecturer courses ", lecturerCourses);
    if (lecturerCourses[0] == true) {
        handleSuccessResponse(res, "List of Lecturer courses", 200, { courses: lecturerCourses[1] })
    } else {
        handleErrorResponse(res, "No course assigned to lecturer", 404)
    }

}

const getAllCourses = async (req, res) => {
    // Instantiating the AdminClass() because the getAllCourses() method which queries our database is defined on that class
    const courses = await new AdminClass().getAllCourses()
    console.log("COurses -", courses);
    handleSuccessResponse(res, "All Courses in the System", 200, { courses })
}

// const coursesByLecturer = async (req, res) => {
//     const { lecturerId } = req.params;
//     let lecturer;

// }

// Edit Course details
const editCourse = async (req, res) => {

}

// To delete a course
const deleteCourse = async (req, res) => {

}

// To add a student to a course
const addStudentToCourse = async (req, res) => {

    try {
        const { courseCode, studentMatricNo } = req.body;

        const courseObject = new CourseClass()  //New Course Class instance
        const studentExists = await new StudentClass().getStudentByIdNum(studentMatricNo);
        const courseExists = await courseObject.getByCourseCode(courseCode);

        if (courseExists[0] == true && studentExists[0] == true) {

            const { takenBy } = courseExists[1];
            const studentIndex = takenBy.findIndex((student) => student.studentMatricNo == studentMatricNo)
            console.log("The index ", studentIndex);

            // If Student has already been added
            if (studentIndex > -1) {
                return handleErrorResponse(res, "Student has already been added to course.", 400)
            } else {

                const studentObject = {
                    studentId: studentExists[1]._id,
                    studentName: `${studentExists[1].firstname} ${studentExists[1].lastname}`,
                    studentMatricNo,
                    studentLevel: studentExists[1].level
                }

                let takenByArr = takenBy.concat(studentObject);         //Concat to return a new array containing the joined array/value
                const fields = {
                    takenBy: takenByArr
                }

                const addStudent = await courseObject.update(courseExists[1]._id, fields)
                // console.log("Add student ", addStudent)

                if (addStudent[0] == true) {
                    handleSuccessResponse(res, "Student added to course successfully.", 200, { course: addStudent[1] })

                } else {
                    handleErrorResponse(res, "Failed to add student to course", 400)
                }
            }

        } else {
            return handleErrorResponse(res, "Student with matric number/ Course code does not exist", 404)
        }
    } catch (error) {
        return handleErrorResponse(res, "Something went wrong - Internal server error. Please try again later", 500)

    }

}

const setAttendanceTimeline = async(req, res) => {
    const { courseId } = req.params;
    
}

module.exports = {
    createCourse,
    editCourse,
    deleteCourse,
    getAllCourses,
    getLecturerCourses,
    addStudentToCourse,
    setAttendanceTimeline
}
