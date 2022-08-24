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
    validate
}