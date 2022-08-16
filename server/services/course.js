class CourseClass {
    constructor(courseTitle, courseCode, classNum) {
        this.courseTitle = courseTitle;
        this.courseCode = courseCode;
        this.classNum = classNum
    }

    getEnrolledStudents(){
        return `There are ${this.classNum} students enrolled`
    }
}

module.exports = {
    CourseClass
}