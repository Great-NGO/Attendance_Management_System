require('dotenv').config();
const express = require('express');
const { studentById, studentUpdatePassword } = require('../controllers/studentController');
const { requireSignin, isStudent } = require('../middleware/auth');
const { validate } = require('../model/user');
const { updatePasswordValidator } = require('../validation.js');
// const { submitAttendance, studentUpdatePassword } = require('../controllers/student');
const router = express.Router();

router.get('/student/:studentId', requireSignin, studentById)

// router.get('/viewCourses/:id', isStudent, studentViewCourses) //Commented the id method from the route because we can find the user id and role from our middleware - isStudent
// router.get('/student/viewCourses', isStudent, studentViewCourses)
// router.get('/viewCourse/:id', isStudent, studentViewCourse)

// router.post('/submitAttendance', isStudent, submitAttendance )

router.put('/editPassword/:studentId', requireSignin, isStudent, updatePasswordValidator, validate, studentUpdatePassword )

module.exports = router;