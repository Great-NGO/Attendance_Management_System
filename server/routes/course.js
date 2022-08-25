require('dotenv').config();
const express = require('express');
const { viewSingleCourse } = require('../controllers/courseController');
const { requireSignin, isLecturer } = require('../middleware/auth');

const router = express.Router();

// Get single course details taking
router.get('/course/:courseId', requireSignin, viewSingleCourse);


module.exports = router;