require('dotenv').config();
const express = require('express');
const { submitCourseAttendance } = require('../controllers/attendanceController');
const { studentViewCourses, studentViewCourse } = require('../controllers/courseController');
const { studentById, studentUpdatePassword } = require('../controllers/studentController');
const { requireSignin, isStudent } = require('../middleware/auth');
const { upload } = require('../utils/upload');
const { updatePasswordValidator, validate, studentSubmitAttendanceValidator} = require('../validation.js');
// const { submitAttendance, studentUpdatePassword } = require('../controllers/student');
const router = express.Router();

// View Student info
router.get('/student/:studentId', requireSignin, studentById)

// To view student courses
router.get('/student/view/courses', requireSignin, isStudent, studentViewCourses)

// To view a particular course - which also shows attendance for that particular course
router.get('/student/view/course/:courseId', requireSignin, isStudent, studentViewCourse)

// For students to submit attendance
// Upload middleware function from multer helps us parse our form req body which is a multipart/form
router.post('/student/course/submitAttendance', requireSignin, isStudent, upload.single('picture'), studentSubmitAttendanceValidator, validate, submitCourseAttendance )

router.put('/student/editPassword/:studentId', requireSignin, isStudent, updatePasswordValidator, validate, studentUpdatePassword )

module.exports = router;