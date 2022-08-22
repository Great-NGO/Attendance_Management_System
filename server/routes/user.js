require('dotenv').config();
const express = require('express');
const { getDepartments } = require('../controllers/homeController');
const { lecturerOrStudentLogin, logout } = require('../controllers/user');
const {  requireSignin } = require('../middleware/auth');
const router = express.Router();
// Auth Middleware
// const { isAdminOrLecturer } = require("../middleware/auth");


// Lecturer and Student have the same login route
router.post('/login', lecturerOrStudentLogin)   //To use/test this route from the frontend or from rest client, call /api/v1/login

router.get('/logout', logout)

// router.post('/forgotPassword', forgotPasswordValidator, forgotPassword)

// router.put('/reset/password/:id', resetPasswordValidator, resetPassword)

module.exports = router;