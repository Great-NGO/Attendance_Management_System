require('dotenv').config();
const express = require('express');
const { getDepartments } = require('../controllers/homeController');
const { lecturerOrStudentLogin, logout, forgotPassword, resetPassword } = require('../controllers/userController');
const {  requireSignin } = require('../middleware/auth');
const { forgotPasswordValidator, validate, resetPasswordValidator } = require('../validation.js');
const router = express.Router();
// Auth Middleware
// const { isAdminOrLecturer } = require("../middleware/auth");


// Lecturer and Student have the same login route
router.post('/login', lecturerOrStudentLogin)   //To use/test this route from the frontend or from rest client, call /api/v1/login

router.get('/logout', logout)

router.post('/forgotPassword', forgotPasswordValidator, validate, forgotPassword)

router.put('/reset/password/:id', resetPasswordValidator, validate, resetPassword)

module.exports = router;