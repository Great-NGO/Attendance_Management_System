const User = require("../model/user");
const { log, warn } = require("../utils/logging");
const { translateError } = require("../utils/mongo_helper");
const { encryptPassword } = require("../utils/password");
const { UserClass } = require("./user");

class StudentClass extends UserClass {
    
    // constructor(idNum, firstname, lastname, password, role) {
    constructor(idNum, firstname, lastname, password, role, email, department, level) {
        super(idNum, firstname, lastname, email, password, role);
        this.department = department;
        this.level = level;

    }

    // Polymorphism - Using the register method from the Parent class but specifying how we want to execute it (Method overriding)
    async register() {
        try {
            let student = new User({
                firstname: this.firstname,
                lastname: this.lastname,
                idNum: this.idNum,
                email: this.email,
                password: await encryptPassword(this.password),
                role: this.role,
                level: this.level,
                department: this.department,
            })
            
            if(await student.save()) {
                return [ true, student]
            } 

        } catch (error) {
            return [false, translateError(error)]
        }
    }

    static async getStudentById(idNum) {
        let student = await User.findOne({idNum, role:"student"});
        // warn(student);
        if(student) {
            return [true, student]
        } else {
            return [ false, "Student does not exist."]
        }
    }

    static async getStudentByEmail(email) {
        let student = await User.findOne({email, role:"student"});
        // warn(student);
        if(student) {
            return [true, student]
        } else {
            return [ false, "Student does not exist."]
        }
    }

    static async getStudentByIdOrEmail(idNumOrEmail) {
        let student = await User.findOne({idNum: idNumOrEmail, role:"student"}) || await User.findOne({email:idNumOrEmail, role: "student"})
        if(student) {
            return [true, student]
        } else {
            return [false, "Student does not exist"]
        }
    }

    static async authenticateStudent(idNumOrEmail, password) {
        let student = await User.findOne({idNum: idNumOrEmail, role:"student"}) || await User.findOne({email:idNumOrEmail, role: "student"})

        if(student && student.validPassword(password)) {
            return [true, student]
        } else {
            return [false, "Invalid email/matric number and password" ]
        }
    }

    // Polymorphism - use getUserFullName() method from User class, but return strings inverted
    getUserFullName(){
        return `${this.lastname} ${this.firstname}`
    }

    async updatePassword(){
        
    }

    async viewCourses() {

    }

    async viewAttendanceHistory() {

    }
}


module.exports = {
    StudentClass,
}