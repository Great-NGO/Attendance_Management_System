const User = require("../model/user");
const { UserClass } = require("./user");

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

    async deleteLecturer() {

    }

    async deleteStudent(){

    }

    static async getAllAdmins() {
        const admins = await User.find({role: "admin"}).select('firstname lastname idNum email role ')
        return admins
    }

    static async getAllLecturers() {
        const lecturers = await User.find({role: "lecturer"}).select('firstname lastname idNum email role department ')
        return lecturers
    }
 
    static async getAllStudents(){
        const students = await User.find({role: "student"}).select('firstname lastname idNum email role department level');
        return students
    }
   
    

}

module.exports = {
    AdminClass
}
