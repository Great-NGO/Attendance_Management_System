require('dotenv').config();
const Course = require('../model/course');
const { AdminClass } = require('../services/adminService');
const { LecturerLocationClass, AttendanceClass } = require('../services/attendanceService');
const { CourseClass } = require("../services/courseService");
const { LecturerClass } = require('../services/lecturerService');
const { StudentClass } = require('../services/studentService');
const { UserClass } = require('../services/userService');
const { logError } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');
const { uploadStudentPicToCloudinary } = require('../utils/upload');



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

const setAttendanceTimeline = async (req, res) => {
    const { courseId } = req.params;
    const lecturerId = req.user.user_id;
    const staffId = req.user.idNum;

    const { canSubmitAttendance, longitude, latitude } = req.body;

    const location = `${latitude}, ${longitude}`;       //Google's format for validation from their api
    // console.log("Location -", location);
    // console.log(canSubmitAttendance)

    const courseObject = new CourseClass()
    const courseExists = await courseObject.getCourseById(courseId);

    if (courseExists[0] !== true) {
        return handleErrorResponse(res, "Course does not exist", 404)
    } else {

        // If not lecturer
        if (courseExists[1].taughtBy.lecturerId != lecturerId) {
            return handleErrorResponse(res, "Not Course Lecturer. Unauthorized!", 401)
        }

        let updateEnableAttendance;

        // Only capture lecturers location if attendance is set to open.
        if (canSubmitAttendance == true || canSubmitAttendance == "true") {
            // const { lecturerLocation } = courseExists[1];
            // const newLocation = lecturerLocation.concat(location)
            // console.log("New Location ", newLocation);

            // Check if lecturer location is the same and has already been captured the same day

            const newLocationObject = new LecturerLocationClass(lecturerId, staffId, courseId, courseExists[1].courseCode, location)
            const newLocation = await newLocationObject.saveLocation()

            console.log("NEW Location ", newLocation);

            updateEnableAttendance = await courseObject.update(courseId, { canSubmitAttendance });


        } else {
            updateEnableAttendance = await courseObject.update(courseId, { canSubmitAttendance });

        }

        // console.log("UPdated ", updateEnableAttendance)
        if (updateEnableAttendance[0] == true) {
            if (canSubmitAttendance == true) {
                return handleSuccessResponse(res, "Attendance opened/enabled.", 200, { course: updateEnableAttendance[1] })

            } else {
                return handleSuccessResponse(res, "Attendance closed/disabled.", 200, { course: updateEnableAttendance[1] })

            }
        } else {
            return handleErrorResponse(res, "Failed to open or close attendance. Try again later", 500)
        }
    }
}



/** FOR STUDENT */
const studentViewCourses = async (req, res) => {

    // try {

    const studentId = req.user.user_id;

    const courseObject = new CourseClass();
    const studentCourses = await courseObject.getCoursesByStudent(studentId);
    console.log("Student courses - ", studentCourses);
    if (studentCourses[0] == true) {
        handleSuccessResponse(res, "List of Student courses ", 200, { courses: studentCourses[1], studentMatricNo: req.user.idNum, })
    } else {
        return handleErrorResponse(res, "Student has not been added to any course", 400)
    }

    // } catch (error) {
    //     console.log(error);
    //     return handleErrorResponse(res, "Something went wrong. Failed to get students courses", 500)   
    // }
}




const studentViewCourse = async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user.user_id;

    const courseObject = new CourseClass()
    const courseExists = await courseObject.getCourseById(courseId);

    if (courseExists[0] == true) {
        // const studentCourse = await courseObject.getStudentSingleCourse(courseId, studentId);
        // console.log("Student course -", studentCourse)
        handleSuccessResponse(res, "Course found", 200, { course: courseExists[1] })

    } else {
        handleErrorResponse(res, "Course not found", 404)
    }
}

const viewSingleCourse = async (req, res) => {
    const { courseId } = req.params;

    const courseObject = new CourseClass()
    const courseExists = await courseObject.getCourseById(courseId);

    if (courseExists[0] == true) {
        handleSuccessResponse(res, "Course found", 200, { course: courseExists[1] })

    } else {
        handleErrorResponse(res, "Course not found", 404)
    }
}

const submitCourseAttendance = async (req, res) => {

    try {

        const studentId = req.user.user_id;
        const studentMatricNo = req.user.idNum;

        const { courseCode, latitude, longitude } = req.body;
        const location = `${latitude}, ${longitude}`;

        const courseObject = new CourseClass()  //New Course Class instance

        const courseExists = await courseObject.getByCourseCode(courseCode);
        const studentExists = await new StudentClass().getStudentByIdNum(studentMatricNo);

        if (courseExists[0] !== true) {
            return handleErrorResponse(res, "Course with course code does not exist", 404)
        } else {

            // If Attendance is closed - student not allowed to submit
            if (courseExists[1].canSubmitAttendance == false) {
                return handleErrorResponse(res, "Attendance has been closed", 401)
            }

            let filePath = req.file && req.file.path;
            // If no picture uploaded
            if (!filePath) {
                return handleErrorResponse(res, "Failed to capture attendance because student picture not captured.", 400)
            }

            let studentCourseAttendance = await new AttendanceClass().getStudentCourseAttendance(courseExists[1]._id, studentId);
            console.log("Student course attendance ", studentCourseAttendance )
            studentCourseAttendance = studentCourseAttendance[1]
            
            const hasTakenAttendance = studentCourseAttendance.findIndex((attendance) => new Date(attendance.date) <= new Date(Date.now()) )
            console.log(hasTakenAttendance)

            if( hasTakenAttendance >= 0) {
                return handleErrorResponse(res, "Student has already taken attendance", 400)
            }

            let uploadedPicture = await uploadStudentPicToCloudinary(filePath);
            console.log("The uploaded student picture ", uploadedPicture);
            uploadedPicture = uploadedPicture.url;

            // If Student has never captured an attendance 

            let studentName = `${studentExists[1].firstname} ${studentExists[1].lastname}`;
            let studentPicture = uploadedPicture;

            // const submitted = await courseObject.update(courseExists[1]._id, {attendance:fields});
            const attendanceObject = new AttendanceClass(courseExists[1]._id, courseCode, studentId, studentName, studentMatricNo, studentPicture, location)
            const submitted = await attendanceObject.submit()
            
            console.log("Submitted ", submitted);
            if (submitted[0] == true) {
                handleSuccessResponse(res, "Attendance has been captured successfully.", 200, { studentAttendance: submitted[1] })
            } else {
                return handleErrorResponse(res, "Failed to submit attendance", 400);
            }

        }


    } catch (error) {
        logError(error)
        return handleErrorResponse(res, "Something went wrong, Failed to capture student's attendance - Internal server error", 500)
    }

}

module.exports = {
    createCourse,
    editCourse,
    deleteCourse,
    getAllCourses,
    getLecturerCourses,
    addStudentToCourse,
    setAttendanceTimeline,
    studentViewCourses,
    studentViewCourse,
    viewSingleCourse,
    submitCourseAttendance
}
