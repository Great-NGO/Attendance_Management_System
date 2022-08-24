require('dotenv').config();
const express = require('express');
const { getLecturerCourses, addStudentToCourse, setAttendanceTimeline } = require('../controllers/courseController');
const { getLecturerById, lecturerUpdatePassword } = require('../controllers/lecturerController');
const { requireSignin, isLecturer } = require('../middleware/auth');
const { updatePasswordValidator, validate, addStudentToCourseValidator } = require('../validation.js');
// const { studentSignup } = require('../controllers/student');
const router = express.Router();

// Get Lecturer info
router.get('/lecturer/:lecturerId', requireSignin, getLecturerById)

// Get all courses lecturer is taking
router.get('/lecturer/get/courses', requireSignin, isLecturer, getLecturerCourses)

// Add students to a course
router.post('/lecturer/add/studentToCourse', requireSignin, isLecturer, addStudentToCourseValidator, validate, addStudentToCourse )

// Update lecturer password
router.put('/lecturer/editPassword/:lecturerId', requireSignin, isLecturer, updatePasswordValidator, validate, lecturerUpdatePassword )

// Allow student to submit attendance
// router.post('/lecturer/course/OpenAttendance', requireSignin, isLecturer, setAttendanceTimeline)

// Allow student to submit attendance
router.put('/lecturer/course/OpenAttendance/:courseId', requireSignin, isLecturer, setAttendanceTimeline)

// router.put('/lecturer/editAttendance/:courseId', requireSignin, isLecturer, editAttendance)

// router.put('/lecturer/editCourse/:courseId', requireSignin, isLecturer, editCourse)

module.exports = router;