require('dotenv').config();
const express = require('express');
const { studentSignup } = require('../controllers/student');
const router = express.Router();

router.post('/addStudent', studentSignup )

module.exports = router;