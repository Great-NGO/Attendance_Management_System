require('dotenv').config();
const Course = require('../model/course');
const { AdminClass } = require('../services/adminService');
const { LecturerLocationClass, AttendanceClass } = require('../services/attendanceService');
const { CourseClass } = require("../services/courseService");
const { LecturerClass } = require('../services/lecturerService');
const { StudentClass } = require('../services/studentService');
const { UserClass } = require('../services/userService');
const { logError } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');


/** FOR ADMINS/LECTURERS */

// Add/Create a new course
const createCourse = async (req, res) => {

    try {
        const { lecturer, courseDepartment, staffId, courseTitle, courseCode } = req.body;

        const lecturerExists = await LecturerClass.getLecturerByStaffId(staffId)

        if (lecturerExists[0] !== true) {
            return handleErrorResponse(res, "Staff ID entered does not belong to any Lecturer.", 400)
        }

        const courseExists = await new CourseClass().getByCourseCode(courseCode);
        console.log("Course Exists ", courseExists);
        if (courseExists[0] == true) {
            return handleErrorResponse(res, `Course - '${courseCode}' already exists`, 400)
        }

        const taughtBy = {
            lecturerId: lecturerExists[1]._id,
            lecturerName: `${lecturerExists[1].firstname} ${lecturerExists[1].lastname}`,
            staffId
        }

        const courseObject = new CourseClass(taughtBy, courseTitle, courseCode, courseDepartment)
        console.log("Coursee -- ", courseObject);

        const newCourse = await courseObject.add();
        console.log("NEw course -- ", newCourse)

        if (newCourse[0] == true) {
            handleSuccessResponse(res, "New Course created successfully.", 200, { course: newCourse[1] })
        } else {
            return handleErrorResponse(res, "Failed to create course.", 400)
        }

    } catch (error) {
        return handleErrorResponse(res, "Something went wrong. Failed to add course, please try again later!", 500)
    }

}


// Get all courses
const getAllCourses = async (req, res) => {
    // Instantiating the AdminClass() because the getAllCourses() method which queries our database is defined on that class
    const courses = await new AdminClass().getAllCourses()
    console.log("COurses -", courses);
    handleSuccessResponse(res, "All Courses in the System", 200, { courses })
}

// Get all courses a lecturer is taking
const getLecturerCourses = async (req, res) => {

    // const lecturerId = req.user.user_id;
    let lecturerId;
    req.user.role == "lecturer" ? lecturerId = req.user.user_id : lecturerId = req.params.lecturerId
    console.log("Lecturer id ", lecturerId);

    const courseObject = new CourseClass()
    const lecturerCourses = await courseObject.getCoursesByLecturer(lecturerId);
    console.log("Lecturer courses ", lecturerCourses);
    if (lecturerCourses[0] == true) {
        handleSuccessResponse(res, "List of Lecturer courses", 200, { courses: lecturerCourses[1] })
    } else {
        handleErrorResponse(res, "No course assigned to lecturer", 404)
    }

}


// Lecturer view course with all attendance for students in that course and locations for that course.
const lecturerViewCourse = async (req, res) => {
    const { courseId } = req.params;
    const lecturerId = req.user.user_id;

    const courseObject = new CourseClass();
    const attendanceObject = new AttendanceClass();
    const lecturerObject = new LecturerLocationClass();
    const lecturerCourseExists = await courseObject.getLecturerCourse(courseId, lecturerId);
    console.log("LecturerCourseExists ", lecturerCourseExists)

    if (lecturerCourseExists[0] == true) {
        const lecturersCourseAttendance = await attendanceObject.getCourseAttendance(courseId);
        console.log("LeCturers course attendance ", lecturersCourseAttendance);
        const location = await lecturerObject.findByLecturerIdAndCourseId(lecturerId, courseId);
        console.log("Location for lecturer ", location)

        handleSuccessResponse(res, "Lecturers courses ", 200, { info: "Loop through the attendance array to get all the attendance for a particular student (using their student Matric no from the takenBy from the course object.)", course: lecturerCourseExists[1], attendance: lecturersCourseAttendance[1], locations: location[1] })
    } else {
        handleErrorResponse(res, "Lecturer does not teach that course.", 404)
    }
}

// Edit Course details
const editCourse = async (req, res) => {

}

// To delete a course
const deleteCourse = async (req, res) => {

}

// Lecturer add a student to a course
const addStudentToCourse = async (req, res) => {

    try {
        const lecturerId = req.user.user_id;
        const { courseCode, studentMatricNo } = req.body;

        const courseObject = new CourseClass()  //New Course Class instance
        const studentExists = await new StudentClass().getStudentByIdNum(studentMatricNo);
        const courseExists = await courseObject.getByCourseCode(courseCode);

        if (courseExists[0] == true && studentExists[0] == true) {

            const { takenBy } = courseExists[1];
            const studentIndex = takenBy.findIndex((student) => student.studentMatricNo == studentMatricNo)
            console.log("The index ", studentIndex);

            // If not lecturer is not the course lecturer
            if (courseExists[1].taughtBy.lecturerId != lecturerId) {
                return handleErrorResponse(res, "Not Course Lecturer. Unauthorized!", 401)
            }
            // If Student has already been added
            else if (studentIndex > -1) {
                return handleErrorResponse(res, "Student has already been added to course.", 400)
            } else {

                const studentObject = {
                    studentId: studentExists[1]._id,
                    studentName: `${studentExists[1].firstname} ${studentExists[1].lastname}`,
                    studentMatricNo,
                    studentLevel: studentExists[1].level
                }

                let takenByArr = takenBy.concat(studentObject);         //Concat to return a new array containing the joined array/value
                const fields = {
                    takenBy: takenByArr
                }

                const addStudent = await courseObject.update(courseExists[1]._id, fields)
                // console.log("Add student ", addStudent)

                if (addStudent[0] == true) {
                    handleSuccessResponse(res, "Student added to course successfully.", 200, { course: addStudent[1] })

                } else {
                    handleErrorResponse(res, "Failed to add student to course", 400)
                }
            }

        } else {
            return handleErrorResponse(res, "Student with matric number/ Course code does not exist", 404)
        }
    } catch (error) {
        // console.log("Error ", error)
        return handleErrorResponse(res, "Something went wrong - Internal server error. Please try again later", 500)

    }

}

// Lecturer Edit Course details - To set the number of times a classes is going to be taught in a semester
const lecturerEditCourse = async (req, res) => {
    const lecturerId = req.user.user_id;
    const { courseId } = req.params;
    const { attendanceNum } = req.body;
    console.log("Att num -", attendanceNum)

    const courseObject = new CourseClass()
    const courseExists = await courseObject.getCourseById(courseId);

    if (courseExists[0] !== true) {
        return handleErrorResponse(res, "Course does not exist", 404)
    } else {
        // If lecturer is not the one taking the course
        if (courseExists[1].taughtBy.lecturerId != lecturerId) {
            return handleErrorResponse(res, "Lecturer does not teach course. Not authorized!", 401)
        }

        const updateAttNum = await courseObject.update(courseId, { attendanceNum })
        console.log("Update att num ", updateAttNum)
        if (updateAttNum[0] == true) {
            handleSuccessResponse(res, "Attendance count number updated successfully", 200, { course: updateAttNum[1] })
        } else {
            handleErrorResponse(res, "Failed to set attendance count number", 500)
        }

    }
}

// Lecturer Remove a student  offering a course
const removeStudentFromCourse = async (req, res) => {
    const { courseId, studentId } = req.params;
    const lecturerId = req.user.user_id;

    const courseObject = new CourseClass()
    const studentObject = new StudentClass();
    const courseExists = await courseObject.getCourseById(courseId);
    const studentExists = await studentObject.getById(studentId);


    if (courseExists[0] !== true) {
        return handleErrorResponse(res, "Course does not exist", 404)
    } else if (studentExists[0] !== true) {
        return handleErrorResponse(res, "Student does not exist", 404)
    } else if (courseExists[0] !== true && studentExists[0] !== true) {
        return handleErrorResponse(res, "Student and Course not found", 404)
    }
    else {
        // If lecturer is not the one taking the course
        if (courseExists[1].taughtBy.lecturerId != lecturerId) {
            return handleErrorResponse(res, "Lecturer does not teach course. Not authorized!", 401)
        }

        const updateCourse = await courseObject.removeStudent(courseId, studentId);

        if (updateCourse[0] == true) {
            handleSuccessResponse(res, "Student has been removed from course successfully.", 200, { course: updateCourse[1] })
        } else {
            handleErrorResponse(res, "Failed to remove student from course ", 500)
        }

    }
}

// Lecturer Remove all students offering a course
const removeStudentsFromCourse = async (req, res) => {
    const { courseId } = req.params;
    const lecturerId = req.user.user_id;

    const courseObject = new CourseClass()
    const courseExists = await courseObject.getCourseById(courseId);

    if (courseExists[0] !== true) {
        return handleErrorResponse(res, "Course does not exist", 404)
    } else {
        // If lecturer is not the one taking the course
        if (courseExists[1].taughtBy.lecturerId != lecturerId) {
            return handleErrorResponse(res, "Lecturer does not teach course. Not authorized!", 401)
        }

        const updateCourse = await courseObject.removeStudents(courseId);

        if (updateCourse[0] == true) {
            handleSuccessResponse(res, "Students have been removed from course successfully.", 200, { course: updateCourse[1] })
        } else {
            handleErrorResponse(res, "Failed to remove students from course ", 500)
        }

    }
}



/** FOR STUDENT */
const studentViewCourses = async (req, res) => {

    // try {

    const studentId = req.user.user_id;

    const courseObject = new CourseClass();
    const studentCourses = await courseObject.getCoursesByStudent(studentId);
    console.log("Student courses - ", studentCourses);
    if (studentCourses[0] == true) {
        handleSuccessResponse(res, "List of Student courses ", 200, { courses: studentCourses[1], studentMatricNo: req.user.idNum, })
    } else {
        return handleErrorResponse(res, "Student has not been added to any course", 400)
    }

    // } catch (error) {
    //     console.log(error);
    //     return handleErrorResponse(res, "Something went wrong. Failed to get students courses", 500)   
    // }
}




const studentViewCourse = async (req, res) => {
    const { courseId } = req.params;
    const studentId = req.user.user_id;

    const courseObject = new CourseClass()
    const attendanceObject = new AttendanceClass();
    const studentCourseExists = await courseObject.getStudentSingleCourse(courseId, studentId);

    console.log("Student course -", studentCourseExists)

    if (studentCourseExists[0] == true) {

        // Find the particular student that we are getting attendance for
        const student = studentCourseExists[1].takenBy.find((obj) => obj.studentId == studentId);
        // console.log("Student ", student);

        const studentAttendance = await attendanceObject.getStudentCourseAttendance(courseId, studentId)
        console.log("Get Student Attendance ", studentAttendance);

        // Student attendance score is his/her attendance length plus added score (set by lecturer)
        const attendanceScore = studentAttendance[1].length + student.incrementAttendanceScore;
        // Set/Update student total attendance score 
        await courseObject.setStudentAttScore(courseId, studentId, attendanceScore)

        // Assign the returned student course to a variable and skip the takenBy field(projecting) so we can return it.
        let course = studentCourseExists[1];
        course.takenBy = undefined;

        handleSuccessResponse(res, "Course found", 200, { course, info: `Marked present/absent by lecturer for ${Math.abs(student.incrementAttendanceScore)} time(s)`, attendance: studentAttendance[1], attendanceScore })

    } else {
        handleErrorResponse(res, "Student does not take that course.", 404)
    }
}


const viewSingleCourse = async (req, res) => {
    const { courseId } = req.params;

    const courseObject = new CourseClass()
    const courseExists = await courseObject.getCourseById(courseId);

    if (courseExists[0] == true) {

        handleSuccessResponse(res, "Course found", 200, { course: courseExists[1] })

    } else {
        handleErrorResponse(res, "Course not found", 404)
    }
}



module.exports = {
    createCourse,
    editCourse,
    deleteCourse,
    getAllCourses,
    getLecturerCourses,
    addStudentToCourse,
    lecturerEditCourse,
    studentViewCourses,
    studentViewCourse,
    viewSingleCourse,
    lecturerViewCourse,
    removeStudentFromCourse,
    removeStudentsFromCourse

}
