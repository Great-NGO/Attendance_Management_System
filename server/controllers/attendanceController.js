require('dotenv').config();
const e = require('express');
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

            const newLocationObject = new LecturerLocationClass(lecturerId, staffId, courseId, courseExists[1].courseCode, location)
            const newLocation = await newLocationObject.saveLocation()
            console.log("NEW Location ", newLocation);

            updateEnableAttendance = await courseObject.update(courseId, { canSubmitAttendance });

        } else {
            updateEnableAttendance = await courseObject.update(courseId, { canSubmitAttendance });
        }

        if (updateEnableAttendance[0] == true) {
            if (canSubmitAttendance == true) {
                return handleSuccessResponse(res, "Attendance opened/enabled by lecturer.", 200, { course: updateEnableAttendance[1] })

            } else {
                return handleSuccessResponse(res, "Attendance closed/disabled by lecturer.", 200, { course: updateEnableAttendance[1] })

            }
        } else {
            return handleErrorResponse(res, "Failed to open or close attendance. Try again later", 500)
        }
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

            // If Student's location isn't close to lecturer, don't allow them to submit.
            const { lecturerId } = courseExists[1].taughtBy;
            const lecturerLocationObject = new LecturerLocationClass();
            let lecturerCourseLocations = await lecturerLocationObject.findByLecturerIdAndCourseId(lecturerId, courseExists[1]._id)
            // console.log("Lecturer Course locations ", lecturerCourseLocations);
            lecturerCourseLocations = lecturerCourseLocations[1];

            // The last document in the lecturer location with the specified lecturer id and courseId
            const recentLecturerLocation = lecturerCourseLocations[lecturerCourseLocations.length - 1]
            console.log("The most recent lecturer location ", recentLecturerLocation);

            if (recentLecturerLocation) {
                let lecturerLoc = recentLecturerLocation.location;
                let lecturerLocArr = lecturerLoc.split(",").map(elem => Number(elem));  //Convert to number
                console.log("The Lecturer location array ", lecturerLocArr);

                let studentLocArr = location.split(",").map(elem => Number(elem));
                console.log("The Student location array ", studentLocArr);

                // Convert coordinates to 7dp
                let lecturerLocLat = lecturerLocArr[0].toFixed(7);
                let lecturerLocLong = lecturerLocArr[1].toFixed(7);
                let studentLocLat = studentLocArr[0].toFixed(7);
                let studentLocLong = studentLocArr[1].toFixed(7);


                let latDifference = Math.abs(lecturerLocLat - studentLocLat);
                let longDifference = Math.abs(lecturerLocLong - studentLocLong);

                console.log("Latitude difference in location", latDifference);
                console.log("Longitude difference in location", longDifference);

                let range = 0.001;
                range = range.toFixed(7);

                // If difference in location is more than range then student is not close to lecturer
                if (latDifference > range || longDifference > range) {
                    return handleErrorResponse(res, "Failed to sign attendance - Student distance is too far from lecturer location", 403)
                }

            }

            // File path which holds the students picture
            let filePath = req.file && req.file.path;
            // If no picture uploaded
            if (!filePath) {
                return handleErrorResponse(res, "Failed to capture attendance because student picture not captured.", 400)
            }

            // Find students attendance for that course.
            let studentCourseAttendance = await new AttendanceClass().getStudentCourseAttendance(courseExists[1]._id, studentId);
            studentCourseAttendance = studentCourseAttendance[1]
            console.log("Student course attendance 2", studentCourseAttendance)

            // const hasTakenAttendance = studentCourseAttendance.findIndex((attendance) => new Date(attendance.date) < new Date(Date.now()))

            // Return the index of a students attendance object in the students attendance array where the date submitted is less than 24 hours
            const hasTakenAttendance = studentCourseAttendance.findIndex((attendance) => ((Math.abs(new Date(Date.now()).getTime() - new Date(attendance.date).getTime())) / (60 * 60 * 1000)) < 24)
            console.log("Has taken attendance", hasTakenAttendance)

            // If Student has submitted attendance for the day.
            if (hasTakenAttendance >= 0) {
                return handleErrorResponse(res, "Student has already taken attendance", 400)
            }

            // Testing - with localhost
            // let uploadedPicture = filePath;
            let uploadedPicture = await uploadStudentPicToCloudinary(filePath);
            console.log("The uploaded student picture ", uploadedPicture);
            uploadedPicture = uploadedPicture.url;

            let studentName = `${studentExists[1].firstname} ${studentExists[1].lastname}`;
            let studentPicture = uploadedPicture;

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

const lecturerViewStudentAttendance = async (req, res) => {
    const { courseId, studentId } = req.params;
    const lecturerId = req.user.user_id;

    const courseObject = new CourseClass();
    const studentObject = new StudentClass();
    const attendanceObject = new AttendanceClass();
    const courseExists = await courseObject.getCourseById(courseId);
    const studentExists = await studentObject.getById(studentId);

    //If Course does not exist.
    if (courseExists[0] !== true) {
        return handleErrorResponse(res, "Course with course code does not exist", 404)
    } else if (studentExists[0] !== true) {    //If Student does not exist.
        return handleErrorResponse(res, "Student not found.", 404)
    } else if (courseExists[0] !== true && studentExists[0] !== true) {     //If both Student and Course does not exist.
        return handleErrorResponse(res, "Student and Course does not exist.", 404);
    } else {

        // If not lecturer
        if (courseExists[1].taughtBy.lecturerId != lecturerId) {
            return handleErrorResponse(res, "Not Course Lecturer. Unauthorized!", 401)
        }

        const studentAttendance = await attendanceObject.getStudentCourseAttendance(courseId, studentId);
        // Find the particular student that we are getting attendance for
        const student = courseExists[1].takenBy.find((obj) => obj.studentId == studentId);
        // console.log("Student ", student);

        // Student attendance score is his/her attendance length plus added score (set by lecturer)
        const attendanceScore = studentAttendance[1].length + student.incrementAttendanceScore;
        // Set/Update student total attendance score 
        await courseObject.setStudentAttScore(courseId, studentId, attendanceScore)

        // Assign the returned course document to a variable and skip the taken by property
        let course = courseExists[1];
        course.takenBy = undefined;
        course.taughtBy = undefined;


        if (studentAttendance[0] == true) {
            handleSuccessResponse(res, `Student ${studentExists[1].firstname} ${studentExists[1].lastname} attendance for ${courseExists[1].courseCode}.`, 200, { info: `Marked present/absent for ${Math.abs(student.incrementAttendanceScore)} time(s)`, course: courseExists[1], attendance: studentAttendance[1], attendanceScore })

        } else {
            return handleErrorResponse(res, "Failed to get attendance ", 400)
        }

    }

}

const editStudentAttendance = async (req, res) => {

    const { courseId } = req.params;
    const { studentId, studentMatricNo, incrementAttendanceScore } = req.body;

    const courseObject = new CourseClass();
    const studentObject = new StudentClass();
    const attendanceObject = new AttendanceClass();
    const courseExists = await courseObject.getCourseById(courseId);
    console.log("Course exists ", courseExists)
    const studentExists = await studentObject.getById(studentId)
    const studentAttendance = await attendanceObject.getStudentCourseAttendance(courseId, studentId)
    // console.log("The student attendance ", studentAttendance)

    //If Course does not exist.
    if (courseExists[0] !== true) {
        return handleErrorResponse(res, "Course does not exist", 404)
    } else if (studentExists[0] !== true) {
        return handleErrorResponse(res, "Student does not exist", 404)
    } else {
        const oldAttendanceScore = studentAttendance[1].length;

        // If lecturer tries to mark student absent beyond their present attendance score don't allow
        if (incrementAttendanceScore < 0 && incrementAttendanceScore + oldAttendanceScore < 0) {
            return handleErrorResponse(res, `Can not mark student absent for ${Math.abs(incrementAttendanceScore)} times. Student can not be present for less than 0 times`, 403)
        }

        const updateScore = await courseObject.updateIncAttScore(courseId, studentId, incrementAttendanceScore)
        console.log("Update students increment attendance score ", updateScore);

        if (updateScore[0] == true) {

            let attendanceScore = oldAttendanceScore + incrementAttendanceScore;

            // Set/Update student total attendance score 
            await courseObject.setStudentAttScore(courseId, studentId, attendanceScore)

            if (incrementAttendanceScore < 0) {
                return handleSuccessResponse(res, `Updated ${studentExists[1].firstname} ${studentExists[1].lastname} attendance successfully.`, 200, { info: `Marked absent for ${Math.abs(incrementAttendanceScore)} time(s)`, oldAttendanceScore, newAttendanceScore: attendanceScore })
            } else {
                return handleSuccessResponse(res, `Updated ${studentExists[1].firstname} ${studentExists[1].lastname} attendance successfully.`, 200, { info: `Marked present for ${Math.abs(incrementAttendanceScore)} more time(s)`, oldAttendanceScore, newAttendanceScore: attendanceScore })
            }
        } else {
            return handleErrorResponse(res, "Failed to update student's attendance", 500)
        }
    }


}


module.exports = {

    setAttendanceTimeline,
    submitCourseAttendance,
    lecturerViewStudentAttendance,
    editStudentAttendance
}



