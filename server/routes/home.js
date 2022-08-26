require('dotenv').config();
const express = require('express');
const { getDepartments } = require('../controllers/homeController');
const { getLecturers } = require('../controllers/lecturerController');
const { getStudents, studentById, studentsByDepartment, studentsByLevel, studentsByLevelAndDept } = require('../controllers/studentController');

const {  requireSignin, isAdminOrLecturer } = require('../middleware/auth');
const router = express.Router();
// Auth Middleware

router.get('/departments', getDepartments)

router.get('/lecturers', requireSignin, getLecturers);

router.get('/students', requireSignin, getStudents);

router.get('/students/department/:department', requireSignin, isAdminOrLecturer,studentsByDepartment)

router.get('/students/level/:level', requireSignin, isAdminOrLecturer, studentsByLevel)

router.get('/students/:level/:department', requireSignin, isAdminOrLecturer, studentsByLevelAndDept)

module.exports = router;