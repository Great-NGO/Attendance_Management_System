class CourseClass {
    constructor(taughtBy, courseTitle, courseCode, classNum, takenBy, attendance ) {
        this.taughtBy = taughtBy;
        this.courseTitle = courseTitle;
        this.courseCode = courseCode;
        this.classNum = classNum;
        this.takenBy = takenBy;
        this.attendance = attendance;
    }

    getEnrolledStudents(){
        return `There are ${this.classNum} students enrolled`
    }

    static getCourses() {
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