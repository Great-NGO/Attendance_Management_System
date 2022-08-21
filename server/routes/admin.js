require('dotenv').config();
const express = require('express');
const { lecturerSignup } = require('../controllers/lecturer');
const { studentSignup } = require('../controllers/student');
const { adminSignup, adminLogin, editStudent, editLecturer, deleteStudent, deleteLecturer } = require('../controllers/admin')
const { createStudentValidator, validate, createLecturerValidator, createAdminValidator, editStudentValidator, editLecturerValidator } = require('../validation.js');
const { requireSignin, isAdmin } = require('../middleware/auth');
const router = express.Router();


router.post('/admin/login', adminLogin )

router.post('/admin/addStudent', requireSignin, isAdmin, createStudentValidator, validate, studentSignup )

router.post('/admin/addLecturer', requireSignin, isAdmin, createLecturerValidator, validate, lecturerSignup )

// router.post('/admin/addCourse', isAdmin, addCoursesValidator, validate, createCourse )

// router.put('/admin/editStudent/:id', requireSignin, isAdmin, editStudentValidator, validate, editStudent )
// router.put('/admin/editLecturer/:id', requireSignin, isAdmin, editLecturerValidator, validate, editLecturer )

router.post('/admin/delete/student', requireSignin, isAdmin, deleteStudent)
router.post('/admin/delete/lecturer', requireSignin, isAdmin, deleteLecturer)

// Only to create default admin
router.post('/auth/admin/register', createAdminValidator, validate, adminSignup)    


module.exports = router;