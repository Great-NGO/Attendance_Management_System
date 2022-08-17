require('dotenv').config();
const express = require('express');
const { getDepartments, getLecturers, getStudents } = require('../controllers/home');
const router = express.Router();
// Auth Middleware
// const { isAdminOrLecturer } = require("../middleware/auth");

// const { getAllStudents } = require('../controllers/admin');

router.get('/departments', getDepartments)

router.get('/lecturers', getLecturers);

router.get('/students', getStudents);


// router.get('/getAllStudents', isAdminOrLecturer, getAllStudents)
// router.get('/student/:studentId', getStudentById)

// router.post('/login', studentLecturerLogin)

module.exports = router;