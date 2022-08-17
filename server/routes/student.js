require('dotenv').config();
const express = require('express');
// const { submitAttendance, studentUpdatePassword } = require('../controllers/student');
const router = express.Router();

// router.get('/viewCourses/:id', isStudent, studentViewCourses) //Commented the id method from the route because we can find the user id and role from our middleware - isStudent
// router.get('/viewCourses', isStudent, studentViewCourses)
// router.get('/viewCourse/:id', isStudent, studentViewCourse)

// router.post('/submitAttendance', isStudent, submitAttendance )

// router.put('/editPassword', isStudent, studentUpdatePassword )

module.exports = router;