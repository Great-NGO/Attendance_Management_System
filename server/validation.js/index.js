// ERROR HANDLING and VALIDATION

const {check, body, validationResult } = require("express-validator");

const createStudentValidator =  [

        check("firstname", "Student's firstname is required").trim().notEmpty().isLength({ min: 3}),
        check("lastname", "Student's lastname is required").trim().notEmpty().isLength({min: 3}),    
        check("email", "Student's Babcock email is required").notEmpty().isEmail(),
        check("idNum","Enter Student's identification number(matric number)").trim().notEmpty(),
        check("password", "Password is required.").trim().notEmpty(),
        check("password", "Password must not be less than 8 characters").isLength({min:8}),
        check("role", "Select 'student' as role").matches(/^student$/),
        check("department", "Enter Student's department").notEmpty(),
        check("level", "Enter Student's current level").isNumeric()

]
 
const createLecturerValidator =  [

        check("firstname", "Lecturer's firstname is required").trim().notEmpty().isLength({ min: 3}),
        check("lastname", "Lecturer's lastname is required").trim().notEmpty().isLength({min: 3}),    
        check("email", "Lecturer's email is required").notEmpty().isEmail(),
        check("idNum","Enter Lecturer's identification number(Staff ID)").trim().notEmpty(),
        check("password", "Password is required.").trim().notEmpty(),
        check("password", "Password must not be less than 8 characters").isLength({min:8}),
        check("role", "Select 'lecturer' as role").notEmpty().matches(/^lecturer$/)
   
]
 
const createAdminValidator =  [

        check("firstname", "Admin's firstname is required").trim().notEmpty().isLength({ min: 3}),
        check("lastname", "Admin's lastname is required").trim().notEmpty().isLength({min: 3}),    
        check("email", "Admin's email is required").notEmpty().isEmail(),
        check("idNum","Enter Admin's identification number").trim().notEmpty(),
        check("password", "Password is required.").trim().notEmpty(),
        check("password", "Password must not be less than 8 characters").isLength({min:8}),
        check("role", "Select 'admin' as role").notEmpty().matches(/^admin$/)
   
]
 

// const createStudentValidator = (req, res, next) => {
//     const validationRules = [
//         check("firstname", "Student's firstname is required").trim().notEmpty().isLength({ min: 3}),
//         check("lastname", "Student's lastname is required").trim().notEmpty().min({min: 3})    
//     ]
 
// }

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
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
    validate
}