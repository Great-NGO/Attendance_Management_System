const User = require("../model/user");
const { log, warn } = require("../utils/logging");
const { translateError } = require("../utils/mongo_helper");
const { encryptPassword } = require("../utils/password");
const { UserClass } = require("./user");

class StudentClass extends UserClass {
    
    // constructor(idNum, firstname, lastname, password, role) {
    constructor(idNum, firstname, lastname, password, role, level, department) {
        super(idNum, firstname, lastname, password, role);
        this.level = level;
        this.department = department
    }

    // async createStudent(level, department) {
    //     try {
    //         let student = new User({
    //             firstname: this.firstname,
    //             lastname: this.lastname,
    //             idNum: this.idNum,
    //             role: this.role,
    //             level,
    //             department,
    //         })
    //         student.setPassword(this.password)
            
    //         if(await student.save()) {
    //             return [ true, student]
    //         } 

    //     } catch (error) {
    //         return [false, translateError(error)]
    //     }
    // }
  
    static async createStudent({firstname, lastname, idNum, password, role, level, department}) {
        try {
            let student = new User({
                firstname,
                lastname,
                idNum,
                password:await encryptPassword(password),
                role,
                level,
                department,
            })
            console.log("The password ", password)
      
 
            // student.stringLog(firstname)
            console.log("The studenttt ", student)
            
            if(await student.save()) {
                return [ true, student]
            } 

        } catch (error) {
            return [false, translateError(error)]
        }
    }

    static async getStudentById(idNum) {
        let student = await User.findOne({idNum, role:"student"});
        warn(student);
        if(student) {
            return [true, student]
        } else {
            return [ false, "Student does not exist."]
        }
    }

    async viewCourses() {

    }

    async viewAttendanceHistory() {

    }
}

async function getStudentById(idNum) {
    let student = await User.findOne({idNum, role:"student"});
    warn(student);
    if(student) {
        return [true, student]
    } else {
        return [ false, "Student does not exist."]
    }
}

module.exports = {
    StudentClass,
    getStudentById
}