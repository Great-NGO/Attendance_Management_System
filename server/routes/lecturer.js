require('dotenv').config();
const express = require('express');
const { getLecturerCourses, addStudentToCourse, setAttendanceTimeline, viewSingleCourse } = require('../controllers/courseController');
const { getLecturerById, lecturerUpdatePassword } = require('../controllers/lecturerController');
const { requireSignin, isLecturer } = require('../middleware/auth');
const { updatePasswordValidator, validate, addStudentToCourseValidator, setAttendanceTimelineValidator } = require('../validation.js');
// const { studentSignup } = require('../controllers/student');
const router = express.Router();

// Get Lecturer info
router.get('/lecturer/:lecturerId', requireSignin, getLecturerById)

// Get all courses lecturer is taking
router.get('/lecturer/get/courses', requireSignin, isLecturer, getLecturerCourses)

// Get single course is taking
router.get('/lecturer/get/course/:courseId', requireSignin, isLecturer, viewSingleCourse)

// Add students to a course
router.post('/lecturer/add/studentToCourse', requireSignin, isLecturer, addStudentToCourseValidator, validate, addStudentToCourse )

// Update lecturer password
router.put('/lecturer/editPassword/:lecturerId', requireSignin, isLecturer, updatePasswordValidator, validate, lecturerUpdatePassword )

// Allow student to submit attendance
router.put('/lecturer/course/OpenAttendance/:courseId', requireSignin, isLecturer, setAttendanceTimelineValidator, validate, setAttendanceTimeline)

// router.put('/lecturer/editAttendance/:courseId', requireSignin, isLecturer, editAttendance)

// To remove students from a course (After semester is over)
// router.put('/lecturer/remove-all/:courseId', requireSignin, isLecturer, removeAllStudents)

// router.put('/lecturer/editCourse/:courseId', requireSignin, isLecturer, editCourse)

module.exports = router;