require('dotenv').config();
const express = require('express');
const { lecturerViewStudentAttendance, setAttendanceTimeline, editStudentAttendance } = require('../controllers/attendanceController');
const { getLecturerCourses, addStudentToCourse, lecturerViewCourse, lecturerEditCourse, removeStudentsFromCourse, removeStudentFromCourse } = require('../controllers/courseController');
const { getLecturerById, lecturerUpdatePassword } = require('../controllers/lecturerController');
const { requireSignin, isLecturer } = require('../middleware/auth');
const { updatePasswordValidator, validate, addStudentToCourseValidator, setAttendanceTimelineValidator, lecturerEditCourseValidator, editStudentAttendanceValidator } = require('../validation.js');
// const { studentSignup } = require('../controllers/student');
const router = express.Router();

// Get Lecturer info
router.get('/lecturer/:lecturerId', requireSignin, getLecturerById)

// Get all courses lecturer is taking
router.get('/lecturer/get/courses', requireSignin, isLecturer, getLecturerCourses)

// Get single course lecturer is taking - which returns the students attendance and lecturers location for the particular course
router.get('/lecturer/get/course/:courseId', requireSignin, isLecturer, lecturerViewCourse )

// Get attendance for a particular student in class
router.get('/lecturer/courses/:courseId/attendance/:studentId', requireSignin, isLecturer, lecturerViewStudentAttendance)

// Add students to a course
router.post('/lecturer/add/studentToCourse', requireSignin, isLecturer, addStudentToCourseValidator, validate, addStudentToCourse )

// Update lecturer password
router.put('/lecturer/editPassword/:lecturerId', requireSignin, isLecturer, updatePasswordValidator, validate, lecturerUpdatePassword )

// Allow student to submit attendance
router.put('/lecturer/course/OpenAttendance/:courseId', requireSignin, isLecturer, setAttendanceTimelineValidator, validate, setAttendanceTimeline)

// Lecturer edit student attendance for a particular course
router.put('/lecturer/edit-attendance/:courseId', requireSignin, isLecturer, editStudentAttendanceValidator, validate, editStudentAttendance)

// Remove student from a course
router.put('/lecturer/remove/:courseId/student/:studentId', requireSignin, isLecturer, removeStudentFromCourse) 

// To remove all students from a course (After semester is over)
router.put('/lecturer/students/remove-all/:courseId', requireSignin, isLecturer, removeStudentsFromCourse)

// Edit number of classes in a semester
router.put('/lecturer/set-attendance-num/:courseId', requireSignin, isLecturer, lecturerEditCourseValidator, validate, lecturerEditCourse)

module.exports = router;