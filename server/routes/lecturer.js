require('dotenv').config();
const express = require('express');
const { getLecturerById, lecturerUpdatePassword } = require('../controllers/lecturerController');
const { requireSignin, isLecturer } = require('../middleware/auth');
const { updatePasswordValidator, validate } = require('../validation.js');
// const { studentSignup } = require('../controllers/student');
const router = express.Router();

router.get('/lecturer/:lecturerId', requireSignin, getLecturerById)

// router.post('/lecturer/addStudentToCourse', isLecturer, addStudentToCourse )

router.put('/lecturer/editPassword/:lecturerId', requireSignin, isLecturer, updatePasswordValidator, validate, lecturerUpdatePassword )

// router.post('/lecturer/course/OpenAttendance', requireSignin, isLecturer, setAttendanceTimeline)
// router.put('/lecturer/course/OpenAttendance/:courseId', requireSignin, isLecturer, setAttendanceTimeline)

// router.put('/lecturer/editAttendance/:courseId', requireSignin, isLecturer, editAttendance)

// router.put('/lecturer/editCourse/:courseId', requireSignin, isLecturer, editCourse)

module.exports = router;