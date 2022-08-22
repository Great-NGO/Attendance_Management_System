require('dotenv').config();
const express = require('express');
const { lecturerSignup, deleteLecturer, editLecturer } = require('../controllers/lecturerController');
const { studentSignup, deleteStudent, editStudent } = require('../controllers/studentController');
const { adminSignup, adminLogin, deleteAdmin, adminUpdatePassword, adminById } = require('../controllers/adminController')
const { createStudentValidator, validate, createLecturerValidator, createAdminValidator, editStudentValidator, editLecturerValidator, updatePasswordValidator } = require('../validation.js');
const { requireSignin, isAdmin } = require('../middleware/auth');
const router = express.Router();

// To View Admins detail (Get Admin's info)
router.get('/admin/current', requireSignin, isAdmin, adminById)

router.post('/admin/login', adminLogin )

router.post('/admin/addStudent', requireSignin, isAdmin, createStudentValidator, validate, studentSignup )

router.post('/admin/addLecturer', requireSignin, isAdmin, createLecturerValidator, validate, lecturerSignup )

// router.post('/admin/addCourse', isAdmin, addCoursesValidator, validate, createCourse )

router.put('/admin/editStudent/:id', requireSignin, isAdmin, editStudentValidator, validate, editStudent )
router.put('/admin/editLecturer/:id', requireSignin, isAdmin, editLecturerValidator, validate, editLecturer )

router.post('/admin/delete/student', requireSignin, isAdmin, deleteStudent)
router.post('/admin/delete/lecturer', requireSignin, isAdmin, deleteLecturer)

// router.post('/admin/forgotPassword', forgotPasswordValidator, adminForgotPassword)

// router.put('/admin/reset/password/:id', resetPasswordValidator, adminResetPassword)

// Only to create default admin
router.post('/auth/admin/register', createAdminValidator, validate, adminSignup)    

// To update an admin's password
router.put('/auth/admin/update/password', requireSignin, isAdmin, updatePasswordValidator, validate, adminUpdatePassword)

// To delete an admin account
router.delete('/auth/admin/delete', requireSignin, isAdmin, deleteAdmin)
module.exports = router;