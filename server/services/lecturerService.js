const User = require("../model/user");
const { UserClass } = require("./userService");
const { log, warn, logError } = require("../utils/logging");
const { translateError } = require("../utils/mongo_helper");
const { encryptPassword } = require("../utils/password");

class LecturerClass extends UserClass {

    constructor(idNum, firstname, lastname, password, role, email, department) {
        super(idNum, firstname, lastname, email, password, role);
        this.department = department
    }

    /** Polymorphism - Using the register method from the Parent class but specifying how we want to execute it (Method overriding) */
    async register() {
        try {
            let lecturer = new User({
                firstname: this.firstname,
                lastname: this.lastname,
                idNum: this.idNum,
                email: this.email,
                password: await encryptPassword(this.password),
                role: this.role,
                department: this.password,

            })

            if (await lecturer.save()) {
                return [true, lecturer]
            }

        } catch (error) {
            return [false, translateError(error)]
        }
    }

    /** Polymorphism - Using the getById() from our User Class */
    async getById(id) {
        try {
            const user = await User.findById(id);
            if (user) {
                if (user.role == "lecturer") {
                    return [true, user]
                } else {
                    return [false, "Lecturer does not exist"]
                }
            } else {
                return [false, "Lecturer does not exist"]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    /** Polymorphism - Using the update method from the parent class to update a lecturer */
    async update(fields) {
        try {
            const lecturer = await this.getByIdNum(this.idNum);
            if (lecturer[0] != false) {
                if (lecturer[1].role == "lecturer") {
                    const updatedLecturer = await User.findByIdAndUpdate(lecturer[1]._id, fields, { new: true })
                    if (updatedLecturer) {
                        let returnedLecturer = updatedLecturer;
                        returnedLecturer.password=undefined;
                        return [true, returnedLecturer, "Lecturer updated successfully"]
                    } else {
                        return [false, "Failed to update Lecturer."]
                    }
                } else {
                    return [false, "Update failed - Not a lecturer."]
                }
            } else {
                return [false, "Lecturer does not exist."]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    /** Polymorphism - Using the delete method from the parent class to delete a lecturer */
    async delete() {
        try {
            const lecturer = await this.getByIdNum(this.idNum);
            if (lecturer[0] != false) {
                if (lecturer[1].role == "lecturer") {
                    const deletedLecturer = await User.findByIdAndDelete(lecturer[1]._id)
                    if (deletedLecturer) {
                        return [true, deletedLecturer, "Lecturer deleted successfully"]
                    } else {
                        return [false, "Failed to delete Lecturer.", 400]
                    }
                } else {
                    return [false, "Delete failed - Not a lecturer.", 400]
                }
            } else {
                return [false, "Lecturer does not exist.", 404]
            }
        } catch (error) {
            return [false, translateError(error), 500]
        }
    }


    static async getLecturerById(idNum) {
        let lecturer = await User.findOne({ idNum, role: "lecturer" });
        if (lecturer) {
            return [true, lecturer]
        } else {
            return [false, "Lecturer does not exist"]
        }
    }

    static async getLecturerByEmail(email) {
        let lecturer = await User.findOne({ email, role: "lecturer" });
        if (lecturer) {
            return [true, lecturer]
        } else {
            return [false, "Lecturer does not exist"]
        }
    }

    // Defined on both Admin and Lecturer Class
    static async getStudentsByDept(department) {
        try {
            const students = await User.find({ role: "student", department }).select('firstname lastname idNum email role department level');
            return [true, students]
        } catch (error) {
            return [false, translateError(error)]
        }

    }

    // Defined on both Admin and Lecturer Class
    static async getStudentsByLevel(level) {
        try {
            const students = await User.find({ role: "student", level });
            return [true, students]
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // Defined on both Admin and Lecturer Class
    static async getStudentsByLevelAndDept(level, department) {
        try {
            const students = await User.find({ role: "student", level, department });
            return [true, students]
        } catch (error) {
            return [false, translateError(error)]
        }
    }


    async addCourse() {

    }

    // View all courses he takes - polymorphism
    async viewCourses() {

    }

    async viewAttendanceHistory() {

    }

    async viewAttendance() {

    }

    async addStudent() {

    }
}

module.exports = {
    LecturerClass
}