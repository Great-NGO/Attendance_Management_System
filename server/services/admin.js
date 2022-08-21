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

    // // Delete Lecturer method which is static because only an admin can delete an admins account
    // static async deleteLecturer(idNum) {

    // }

    // Delete Student method which is static because only an admin can delete a students account
    static async deleteStudent(id){
        try {
            const user = await User.findById(id)
            if(user) {
                return [ true, user]
            } else {
                return [false, "User does not exist."]
            }
        } catch (error) {
            
        }
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
