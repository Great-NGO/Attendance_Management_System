const Course = require("../model/course");
const { translateError } = require("../utils/mongo_helper");

class CourseClass {
    constructor(taughtBy, courseTitle, courseCode, courseDepartment, takenBy, attendance, attendanceNum ) {
        this.taughtBy = taughtBy;
        this.courseTitle = courseTitle;
        this.courseCode = courseCode;
        // this.classNum = classNum;
        this.courseDepartment = courseDepartment;
        this.takenBy = takenBy;
        this.attendance = attendance;
        this.attendanceNum = attendanceNum;
    }

    
    // async addCourse(){
    async add(){
        try {
            let course = new Course({
                taughtBy: this.taughtBy,
                courseTitle: this.courseTitle,
                courseCode: this.courseCode,
                courseDepartment: this.courseDepartment,
                takenBy: this.takenBy,
                attendance: this.attendance,
                attendanceNum: this.attendanceNum
            })

            if(await course.save()){
                return [true, course]
            }

        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // async updateCourse(id, fields){
    async update(id, fields){
        try {
            const updatedCourse = await Course.findByIdAndUpdate(id, fields, {new: true});
            if(updatedCourse) {
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
            if(deletedCourse) {
                return [true, deletedCourse, "Course deleted successfully"];
            } else {
                return [false, "Failed to delete course"]
            }
            
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    async getCourseById(id) {
        try {
            const course = await Course.findById(id);
            if(course){
                return [ true, course]
            } else {
                return [false, "Course does not exist"]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    async getByCourseCode(courseCode){
    // async getByCourseCode(){
        const course = await Course.findOne({courseCode})
        // const course = await Course.findOne({courseCode:this.courseCode});
        if(course) {
            return [true, course]
        } else {
            return [false, "Course not found"]
        }
    }

    async getCoursesByLecturer(lecturerId) {
        try {
            const courses = await Course.find({ 'taughtBy.lecturerId' : lecturerId }, '-taughtBy');
            // const courses = await Course.find({ 'taughtBy.lecturerId' : lecturerId });
            return [ true, courses]
            
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    async getCoursesByStudent(studentId) {
        try {
        
            const courses = await Course.find({'takenBy.studentId':studentId}, '-takenBy');
            return [ true, courses]
            
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    // async getStudentSingleCourse(courseId, studentId) {
    //     try {
            
    //         // const courses = await Course.findOne({})
    //         const courses = await this.getCoursesByStudent(studentId);
    //         console.log("STUD COURSES ", courses);
    //         const singleCourse = await Course.findById(courseId);
    //         console.log('SINGLE COURSe ', singleCourse)
    //         if(singleCourse){
    //             const studentCourse = courses[1].includes(singleCourse);
    //             console.log("Student Course ", studentCourse);
    //             if(studentCourse == true) {
    //                 return [ true, singleCourse]
    //             } else{
    //                 return [false, "User not taking course"]
    //             }
    //         } else {
    //             return [false, 'Course does not exist.']
    //         }
    //     } catch (error) {
    //         return [false, translateError(error)]
    //     }
    // }

    // async getAllCourses() {

    // }

    getEnrolledStudents(){
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