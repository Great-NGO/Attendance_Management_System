// ERROR HANDLING and VALIDATION

const { check, body, validationResult } = require("express-validator");
const { UserClass } = require("../services/userService");

const createStudentValidator = [

    check("firstname", "Student's firstname is required").trim().notEmpty().isLength({ min: 3 }),
    check("lastname", "Student's lastname is required").trim().notEmpty().isLength({ min: 3 }),
    check("email", "Student's mail is required").notEmpty().isEmail(),
    check("idNum", "Enter Student's identification number(matric number)").trim().notEmpty(),
    check("password", "Password is required.").trim().notEmpty(),
    check("password", "Password must not be less than 8 characters").isLength({ min: 8 }),
    check("role", "Select 'student' as role").matches(/^student$/),
    check("department", "Enter Student's department").notEmpty(),
    check("level", "Enter Student's current level").isNumeric()

]

const editStudentValidator = [
    check("firstname", "Student's firstname is required").trim().notEmpty().isLength({ min: 3 }),
    check("lastname", "Student's lastname is required").trim().notEmpty().isLength({ min: 3 }),
    // check("email", "Student's mail is required").notEmpty().isEmail(),
    // check("idNum","Enter Student's identification number(matric number)").trim().notEmpty(),
    // check("role", "Select 'student' as role").matches(/^student$/),
    check("department", "Enter Student's department").notEmpty(),
    check("level", "Enter Student's current level").isNumeric()

]

const createLecturerValidator = [

    check("firstname", "Lecturer's firstname is required").trim().notEmpty().isLength({ min: 3 }),
    check("lastname", "Lecturer's lastname is required").trim().notEmpty().isLength({ min: 3 }),
    check("email", "Lecturer's email is required").notEmpty().isEmail(),
    check("idNum", "Enter Lecturer's identification number(Staff ID)").trim().notEmpty(),
    check("password", "Password is required.").trim().notEmpty(),
    check("password", "Password must not be less than 8 characters").isLength({ min: 8 }),
    check("role", "Select 'lecturer' as role").notEmpty().matches(/^lecturer$/),
    // check("department", "Enter Lecturer's department").notEmpty()


]

const editLecturerValidator = [

    check("firstname", "Lecturer's firstname is required").trim().notEmpty().isLength({ min: 3 }),
    check("lastname", "Lecturer's lastname is required").trim().notEmpty().isLength({ min: 3 }),
    // check("email", "Lecturer's email is required").notEmpty().isEmail(),
    // check("idNum","Enter Lecturer's identification number(Staff ID)").trim().notEmpty(),
    // check("role", "Select 'lecturer' as role").notEmpty().matches(/^lecturer$/)
    // check("department", "Enter Lecturer's department").notEmpty()

]

const createAdminValidator = [

    check("firstname", "Admin's firstname is required").trim().notEmpty().isLength({ min: 3 }),
    check("lastname", "Admin's lastname is required").trim().notEmpty().isLength({ min: 3 }),
    check("email", "Admin's email is required").notEmpty().isEmail(),
    check("password", "Password is required.").trim().notEmpty(),
    check("password", "Password must not be less than 8 characters").isLength({ min: 8 }),
    check("idNum", "Enter Admin's identification number").trim().notEmpty(),
    check("role", "Select 'admin' as role").notEmpty().matches(/^admin$/)

]

const editAdminValidator = [

    check("firstname", "Admin's firstname is required").trim().notEmpty().isLength({ min: 3 }),
    check("lastname", "Admin's lastname is required").trim().notEmpty().isLength({ min: 3 }),
    check("email", "Admin's email is required").notEmpty().isEmail(),
    check("idNum", "Enter Admin's identification number").trim().notEmpty(),
    check("role", "Select 'admin' as role").notEmpty().matches(/^admin$/)

]

const updatePasswordValidator = [
    check("currentPassword", "Please enter your current password").trim().notEmpty(),
    check("currentPassword").custom(async (value, { req }) => {

        const idNum = req.user.idNum;
        const { role } = req.user;
        const isCorrectPassword = await new UserClass(idNum).authenticateUser(idNum, value, role)
        console.log("IS correct password ", isCorrectPassword[0])
        if (isCorrectPassword[0] == false) {
            return Promise.reject()
        }

    }).withMessage("Current Password is incorrect"),
    check("newPassword", "New Password can not be empty").trim().notEmpty(),
    check("newPassword", "New Password must be atleast 8 characters").isLength({ min: 8 }),
    check("newPassword").custom((value, { req }) => {
        const { currentPassword } = req.body;
        if (value === currentPassword) {
            return false        //New Password can not be the same as old password
        } else {
            return true
        }
    }).withMessage("New Password can not be the same as old password"),
    check("confirmPassword", "Please confirm your new password").trim().notEmpty(),
    check("confirmPassword").custom((value, { req }) => {
        const { newPassword } = req.body;

        if (value === newPassword) {
            return true
        } else {
            return false
        }
    }).withMessage("Passwords must match!")

]

const forgotPasswordValidator = [
    check("email", "Email is required").notEmpty().isEmail(),
    check("role", "Select your role - 'student' or 'lecturer'.").notEmpty().matches(/^(lecturer|student)$/)

]

const adminForgotPasswordValidator = [
    check("email", "Email is required").notEmpty().isEmail(),
    check("role", "Select your role - 'admin'. ").notEmpty().matches(/^admin$/)
]

const resetPasswordValidator = [
    check("newPassword", "New Password can not be empty").trim().notEmpty(),
    check("newPassword", "New Password must be atleast 8 characters").isLength({ min: 8 }),
    check("confirmPassword", "Please confirm your new password").trim().notEmpty(),
    check("confirmPassword").custom((value, { req }) => {
        const { newPassword } = req.body;
        if (value === newPassword) {
            return true
        } else {
            return false
        }
    }).withMessage("Passwords must match!")

]

// Add Course Validation rule
const addCourseValidator = [

    check("lecturer", "Enter Course lecturer").trim().notEmpty(),
    check("staffId", "Enter lecturer's staff Id").trim().notEmpty(),
    check("courseTitle", "Enter Course title").trim().notEmpty(),
    check("courseCode", "Enter Course Code").trim().notEmpty(),
    check("courseDepartment", "Enter Course Department").trim().notEmpty()
]

// Edit Course Validation rule
const editCourseValidator = [

    check("lecturer", "Enter Course lecturer").trim().notEmpty(),
    check("staffId", "Enter lecturer's staff Id").trim().notEmpty(),
    check("courseTitle", "Enter Course title").trim().notEmpty(),
    check("courseDepartment", "Enter Course Department").trim().notEmpty()
]

// Add Student to Course Validation rule
const addStudentToCourseValidator = [
    check("courseCode", "Enter the course code of course you want to add student to.").trim().notEmpty(),
    check("studentMatricNo", "Enter student's matric number").trim().notEmpty()
]

const setAttendanceTimelineValidator = [
    check("canSubmitAttendance", "Open or close attendance by setting 'canSubmitAttendance' to true or false").isBoolean(),
    check("latitude", "Lecturer's location latitude position is required").matches(/\d/),
    check("longitude", "Lecturer's location longitude position is required").matches(/\d/)
    // check("lecturerLocation", "Lecturer's location is required").notEmpty(),
    // check("lecturerLocation", "Lecturer's location must be in valid coordinates" ).matches(/d/)
    // check("lecturerLocation", "Lecturer's location must be in valid coordinates" ).matches(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/)
]

// Submit Attendance Students
const studentSubmitAttendanceValidator = [
    check("courseCode", "Enter the course code of course you want to submit attendance for.").trim().notEmpty(),
    check("latitude", "Student's location latitude position is required").matches(/\d/),
    check("longitude", "Student's location longitude position is required").matches(/\d/)
    // check("studentLocation", "Enter student's location.").trim().notEmpty()
    // check("studentMatricNo", "Enter student's matric number").trim().notEmpty()
]


// Lecturer Edit/Set Attendance Num for semester
const lecturerEditCourseValidator = [
    check("attendanceNum", "Enter the number of times attendance is going to be taken for the semester.").notEmpty().isNumeric()

]

// Lecturer Edit Student attendance
const editStudentAttendanceValidator = [
    check("studentId", "Enter student id").trim().notEmpty(),
    check("studentMatricNo", "Enter student matric number.").trim().notEmpty(),
    check("incrementAttendanceScore", "Enter number of marks you want to add/remove from students attendance (incrementAttendanceScore e.g. +2 or -2)").notEmpty().isNumeric()
]

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push(err.msg));

    return res.status(400).json({
        error: extractedErrors[0],
        errors: extractedErrors,
    })
}

module.exports = {
    createStudentValidator,
    createLecturerValidator,
    createAdminValidator,
    editStudentValidator,
    editLecturerValidator,
    editAdminValidator,
    updatePasswordValidator,
    forgotPasswordValidator,
    adminForgotPasswordValidator,
    resetPasswordValidator,
    addCourseValidator,
    editCourseValidator,
    addStudentToCourseValidator,
    setAttendanceTimelineValidator,
    studentSubmitAttendanceValidator,
    lecturerEditCourseValidator,
    editStudentAttendanceValidator,
    validate
}