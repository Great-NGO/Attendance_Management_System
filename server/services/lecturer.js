const User = require("../model/user");
const { UserClass } = require("./user");
const { log, warn, logError } = require("../utils/logging");
const { translateError } = require("../utils/mongo_helper");
const { encryptPassword } = require("../utils/password");

class LecturerClass extends UserClass{

    constructor(idNum, firstname, lastname, password, role, email, department) {
        super(idNum, firstname, lastname, email, password, role);
        this.department = department
    }

    // Polymorphism - Using the register method from the Parent class but specifying how we want to execute it (Method overriding)
    async register() {
        try {
            let lecturer = new User({
                firstname: this.firstname,
                lastname: this.lastname,
                idNum: this.idNum,
                email: this.email,
                password: await encryptPassword(this.password),
                role:this.role,
                department: this.password,

            })

            if(await lecturer.save()) {
                return [true, lecturer]
            } 

        } catch (error) {
            return [false, translateError(error)]
        }
    }

    static async getLecturerById(idNum) {
        let lecturer = await User.findOne({idNum, role:"lecturer"});
        if(lecturer) {
            return [true, lecturer]
        } else {
            return [false, "Lecturer does not exist"]
        }
    }
 
    static async getLecturerByEmail(email) {
        let lecturer = await User.findOne({email, role:"lecturer"});
        if(lecturer) {
            return [true, lecturer]
        } else {
            return [false, "Lecturer does not exist"]
        }
    }

    static async getAllStudents(){
        const students = await User.find({role: "student"}).select('firstname lastname idNum email role department level');
        return students
    }
   


    async addCourse() {

    }

    // View all courses he takes - polymorphism
    async viewCourses() {

    }

    async viewAttendanceHistory(){

    }

    async viewAttendance(){

    }

    async addStudent(){

    }
}

module.exports = {
    LecturerClass
}