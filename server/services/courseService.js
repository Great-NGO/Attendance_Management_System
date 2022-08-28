const Course = require("../model/course");
const { translateError } = require("../utils/mongo_helper");

class CourseClass {
    constructor(taughtBy, courseTitle, courseCode, courseDepartment, takenBy, attendance, attendanceNum) {
        this.taughtBy = taughtBy;
        this.courseTitle = courseTitle;
        this.courseCode = courseCode;
        // this.classNum = classNum;
        this.courseDepartment = courseDepartment;
        this.takenBy = takenBy;
        // this.attendance = attendance;
        this.attendanceNum = attendanceNum;
    }


    // async addCourse(){
    async add() {
        try {
            let course = new Course({
                taughtBy: this.taughtBy,
                courseTitle: this.courseTitle,
                courseCode: this.courseCode,
                courseDepartment: this.courseDepartment,
                takenBy: this.takenBy,
                // attendance: this.attendance,
                attendanceNum: this.attendanceNum
            })

            if (await course.save()) {
                return [true, course]
            }

        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // async updateCourse(id, fields){
    async update(id, fields) {
        try {
            const updatedCourse = await Course.findByIdAndUpdate(id, fields, { new: true });
            if (updatedCourse) {
                return [true, updatedCourse]
            } else {
                return [false, "Failed to update course - Course does not exist."]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // async deleteCourse(id) {
    async delete(id) {
        try {
            const deletedCourse = await Course.findByIdAndDelete(id);
            if (deletedCourse) {
                return [true, deletedCourse, "Course deleted successfully"];
            } else {
                return [false, "Failed to delete course"]
            }

        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // Get a course by its id
    async getCourseById(id) {
        try {
            const course = await Course.findById(id);
            if (course) {
                return [true, course]
            } else {
                return [false, "Course does not exist"]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // Get a course by its course code
    async getByCourseCode(courseCode) {
        // async getByCourseCode(){
        const course = await Course.findOne({ courseCode })
        // const course = await Course.findOne({courseCode:this.courseCode});
        if (course) {
            return [true, course]
        } else {
            return [false, "Course not found"]
        }
    }

    // Get all courses taken by a lecturer
    async getCoursesByLecturer(lecturerId) {
        try {
            const courses = await Course.find({ 'taughtBy.lecturerId': lecturerId }, '-taughtBy');
            // const courses = await Course.find({ 'taughtBy.lecturerId' : lecturerId });
            return [true, courses]

        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // Get all courses a particular student is taking
    async getCoursesByStudent(studentId) {
        try {

            const courses = await Course.find({ 'takenBy.studentId': studentId }, '-takenBy');
            return [true, courses]

        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // Get a single course by a course id and student id
    async getStudentSingleCourse(courseId, studentId) {
        try {

            const studentCourse = await Course.findOne({ _id: courseId, 'takenBy.studentId': studentId });
            console.log('Student single course ', studentCourse)
            if (studentCourse) {

                return [true, studentCourse]

            } else {
                return [false, 'Course not offered by student (Student/Course not found).']
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // Get a course by its id and lecturer
    async getLecturerCourse(courseId, lecturerId) {
        try {

            const lecturerCourse = await Course.findOne({ _id: courseId, 'taughtBy.lecturerId': lecturerId }, '-taughtBy');
            console.log('Lecturer single course ', lecturerCourse)
            if (lecturerCourse) {
                return [true, lecturerCourse]
            } else {
                return [false, 'Course not offered by student (Student/Course not found).']
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // Update the incrementAttendanceScore property
    async updateIncAttScore(courseId, studentId, value) {
        try {

            const studentCourse = await Course.findOneAndUpdate({ _id: courseId, 'takenBy.studentId': studentId }, {"$set" : {'takenBy.$.incrementAttendanceScore': value}} , { new: true});
            console.log('Updated Student single course ', studentCourse)
            if (studentCourse) {

                return [true, studentCourse]

            } else {
                return [false, 'Course not offered by student (Student/Course not found).']
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // Set the student total attendance score 
    async setStudentAttScore(courseId, studentId, value) {
        try {

            const studentCourse = await Course.findOneAndUpdate({ _id: courseId, 'takenBy.studentId': studentId }, {"$set" : {'takenBy.$.attendanceScore': value}} , { new: true});
            console.log('Student total attendance score for single course ', studentCourse)
            if (studentCourse) {

                return [true, studentCourse]

            } else {
                return [false, 'Course not offered by student (Student/Course not found).']
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // Remove student from a particular course
    async removeStudent(courseId, studentId) {
        try {
            // Pull/Remove particular student from course
            const course = await Course.findOneAndUpdate({_id:courseId, 'takenBy.studentId':studentId}, {"$pull": {'takenBy': {"studentId": studentId} }}, {new:true})
            if(course) {
                return [true, course]
            } else{
                return [false, "Course not offered."]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // Remove all students from a particular course
    async removeStudents(courseId) {
        try {
            const course = await Course.findByIdAndUpdate(courseId, {"$set": {'takenBy': []}}, {new:true})
            if(course) {
                return [true, course]
            } else{
                return [false, "Course not offered."]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    getEnrolledStudents() {
        return `There are ${this.classNum} students enrolled`
    }

    static getDepartments() {
        return [
            "Accounting",
            "Agricuture",
            "Agricuture in Agronomy and Landscape design",
            "Agricutural Economics and Extension",
            "Animal Science",
            "Architecture",
            "Biochemistry",
            "Biology",
            "Business Administration",
            "Computer Science",
            "Computer Information Systems",
            "Computer technology",
            "Economics",
            "English studies",
            "English language education",
            "French",
            "French and International relations",
            "Guidance and Counselling",
            "History and International Studies",
            "Information Technology",
            "Information resources management",
            "International Law and Diplomacy (ILD)",
            "Law (LL.B)",
            "Mass Communication",
            "Marketing",
            "Mathematics",
            "Medicine and Surgery (MBBS)",
            "Microbiology",
            "Music",
            "Nursing Science",
            "Physics",
            "Physiology",
            "Political Science",
            "Psychology",
            "Public Administration",
            "Public Health",
            "Social Work and Human Services",
            "Software Engineering",
            "Zoology"

        ];
    }


}

module.exports = {
    CourseClass
}