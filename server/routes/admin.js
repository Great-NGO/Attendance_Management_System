require('dotenv').config();
const express = require('express');
const { lecturerSignup } = require('../controllers/lecturer');
const { studentSignup } = require('../controllers/student');
const { adminSignup } = require('../controllers/admin')
const { createStudentValidator, validate, createLecturerValidator, createAdminValidator } = require('../validation.js');
const router = express.Router();


// router.post('/admin/login', adminLogin )

router.post('/admin/addStudent',  createStudentValidator, validate, studentSignup )
// router.post('/admin/addStudent', isAdmin, createStudentValidator, validate, studentSignup )

router.post('/admin/addLecturer', createLecturerValidator, validate, lecturerSignup )
// router.post('/admin/addLecturer', isAdmin, createLecturerValidator, validate, lecturerSignup )

// router.post('/admin/addCourse', isAdmin, addCoursesValidator, validate, createCourse )
// router.put('/admin/editStudent/:id', isAdmin, editStudentValidator, validate, editStudent )
// router.put('/admin/editLecturer/:id', isAdmin, editLecturerValidator, validate, editLecturer )

// router.delete('/admin/student/:id', isAdmin, deleteStudent)
// router.delete('/admin/lecturer/:id', isAdmin, deleteLecturer)

// Only to create default admin
router.post('/auth/admin/register', createAdminValidator, validate, adminSignup)    


module.exports = router;