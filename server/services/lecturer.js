const { UserClass } = require("./user");

class LecturerClass extends UserClass{


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