require('dotenv').config();
const express = require('express');
const { getDepartments, getLecturers, getStudents } = require('../controllers/home');
const { lecturerOrStudentLogin, logout } = require('../controllers/user');
const { verifyToken, requireSignin } = require('../middleware/auth');
const router = express.Router();
// Auth Middleware
// const { isAdminOrLecturer } = require("../middleware/auth");


// Lecturer and Student have the same login route
router.post('/login', lecturerOrStudentLogin)   //To use/test this route from the frontend or from rest client, call /api/v1/login

router.get('/logout', logout)

module.exports = router;