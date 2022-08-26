const User = require("../model/user");
const { log, warn } = require("../utils/logging");
const { translateError } = require("../utils/mongo_helper");
const { encryptPassword } = require("../utils/password");
const { UserClass } = require("./userService");

class StudentClass extends UserClass {
    
    // constructor(idNum, firstname, lastname, password, role) {
    constructor(idNum, firstname, lastname, password, role, email, department, level) {
        super(idNum, firstname, lastname, email, password, role);
        this.department = department;
        this.level = level;

    }

    /** Polymorphism - Using the register method from the Parent class but specifying how we want to execute it (Method overriding) */
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

    /** Polymorphism - Using the getById() method from our User Class to find a student (We modified the implementation to look for a student) */
    async getById(id) {
        try {
            const user = await User.findById(id);
            if(user) {
                if(user.role == "student") {
                    return [true, user]
                } else {
                    return [false, "Student does not exist"]
                }
            } else {
                return [false, "Student does not exist"]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    /** Polymorphism - Using the update method from the parent class to update a student */
    async update(fields){
        try {
            const student = await this.getByIdNum(this.idNum);
            if(student[0] != false){
                if(student[1].role == "student"){
                    const updatedStudent = await User.findByIdAndUpdate(student[1]._id, fields, {new: true})
                    if(updatedStudent){
                        let returnedStudent = updatedStudent;
                        returnedStudent.password=undefined;
                        return [ true, returnedStudent, "Student updated successfully"]
                    } else {
                        return [ false, "Failed to update Student."]
                    }
                } else {
                    return [false, "Update failed - Not a student."]
                }
            } else{
                return [false, "Student does not exist."]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    /** Polymorphism - Using the delete method from the parent class to delete a student */
    async delete(){
        try {
            const student = await this.getByIdNum(this.idNum);
            if(student[0] != false){
                if(student[1].role == "student"){
                    const deletedStudent = await User.findByIdAndDelete(student[1]._id)
                    if(deletedStudent){
                        return [ true, deletedStudent, "Student deleted successfully"]
                    } else {
                        return [ false, "Failed to delete Student."]
                    }
                } else {
                    return [false, "Delete failed - Not a student."]
                }
            } else{
                return [false, "Student does not exist."]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    async getStudentByIdNum(idNum) {
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

    async viewCourses() {

    }

    async viewAttendanceHistory() {

    }
}


module.exports = {
    StudentClass,
}