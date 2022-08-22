const User = require("../model/user");
const { translateError } = require("../utils/mongo_helper");
const { UserClass } = require("./userService");

class AdminClass extends UserClass{

    constructor(idNum, firstname, lastname, email, password, role) {
        super(idNum, firstname, lastname, email, password, role)
    }

    async addLecturer(){

    }

    async addStudent(){

    }

    async addCourses() {

    }

    async assignCourseToLecturer(){

    }

    static async getAllAdmins() {
        const admins = await User.find({role: "admin"}).select('firstname lastname idNum email role ')
        return admins
    }

    static async getAllLecturers() {
        const lecturers = await User.find({role: "lecturer"}).select('firstname lastname idNum email role department ')
        return lecturers
    }

    // Defined on both Admin and Lecturer Class
    static async getStudentsByDept (department) {
        try {
            const students = await User.find({role: "student", department}).select('firstname lastname idNum email role department level');
            return [true, students]
        } catch (error) {
            return [false, translateError(error)]
        }
       
    }

    // Defined on both Admin and Lecturer Class
    static async getStudentsByLevel(level){
        try {
            const students = await User.find({role: "student", level});
            return [true, students]
        } catch (error) {
            return [false, translateError(error)]
        }
    }    

    // Defined on both Admin and Lecturer Class
    static async getStudentsByLevelAndDept(level, department){
        try {
            const students = await User.find({role: "student", level, department});
            return [true, students]
        } catch (error) {
            return [false, translateError(error)]
        }
    }    

}

module.exports = {
    AdminClass
}
