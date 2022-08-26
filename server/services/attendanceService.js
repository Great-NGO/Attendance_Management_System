
const { Attendance, LecturerLocation } = require("../model/attendance");
const { translateError } = require("../utils/mongo_helper");

class AttendanceClass {
    constructor(courseId, courseCode, studentId, studentName, studentMatricNo, studentPicture, studentLocation, semester, session, date) {
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentMatricNo = studentMatricNo;     //Track attendance for student
        this.studentPicture = studentPicture;
        this.studentLocation = studentLocation;
        this.semester = semester;       //Track attendance for a semester
        this.session = session;          //Track attendance for a session
        this.date = date
    }


    async submit() {
        try {
            let attendance = new Attendance({
                courseId: this.courseId,
                courseCode: this.courseCode,
                studentId: this.studentId,
                studentName: this.studentName,
                studentMatricNo: this.studentMatricNo,
                studentPicture: this.studentPicture,
                studentLocation: this.studentLocation,
                semester: this.semester,
                session: this.session,
                date: this.date
            })

            if (await attendance.save()) {
                return [true, attendance]
            }

        } catch (error) {
            return [false, translateError(error)]
        }
    }


    async remove(id) {
        try {
            const removedAttendance = await Attendance.findByIdAndDelete(id);
            if (removedAttendance) {
                return [true, removedAttendance, "Attendance removed successfully"];
            } else {
                return [false, "Failed to remove attendace"]
            }

        } catch (error) {
            return [false, translateError(error)]
        }
    }

    async getAttendanceById(id) {
        try {
            const attendance = await Attendance.findById(id);
            if (attendance) {
                return [true, attendance]
            } else {
                return [false, "Attendance does not exist"]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    async getStudentAttendance(studentMatricNo) {

        const studentAttendance = await Attendance.find({ studentMatricNo })
        if (studentAttendance) {
            return [true, studentAttendance]
        } else {
            return [false, "Attendance for student with matric number not found"]
        }
    }

    async findStudentAttendance(studentId) {

        try {
            const studentAttendance = await Attendance.find({ studentId })
            if (studentAttendance) {
                return [true, studentAttendance]
            } else {
                return [false, "Student Attendance not found"]
            }
        } catch (error) {
            return [false, translateError(error)]
        }

    }

    // Find all attendance for a given courseCode
    async courseAttendance(courseCode) {
        const courseAttendance = await Attendance.find({ courseCode })
        if (courseAttendance) {
            return [true, courseAttendance]
        } else {
            return [false, `Attendance for '${courseCode}' not found. `]
        }
    }

    // Find all attendance for a given courseId 
    async getCourseAttendance(courseId) {
        try {
            const courseAttendance = await Attendance.find({ courseId })
            if (courseAttendance) {
                return [true, courseAttendance]
            } else {
                return [false, "No Attendance found."]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    /** Find Student Attendance method which returns students attendance for a course*/
    async findStudentCourseAttendance(courseCode, studentMatricNo) {
        const studentAttendance = await Attendance.find({ courseCode, studentMatricNo })
        if (studentAttendance) {
            return [true, studentAttendance]
        } else {
            return [false, "No Attendance found for student with matric no and with specified course code."]
        }
    }

    /** Get Student Attendance method which returns students attendance for a course*/
    async getStudentCourseAttendance(courseId, studentId) {
        try {
            const studentAttendance = await Attendance.find({ courseId, studentId });
            if (studentAttendance) {
                return [true, studentAttendance]
            } else {
                return [false, "Attendance record not found."]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }



}





/** LECTURER LOCATION CLASS */
class LecturerLocationClass {
    constructor(lecturerId, staffId, courseId, courseCode, location, date) {
        this.lecturerId = lecturerId;
        this.staffId = staffId;
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.location = location;
        this.date = date;
    }

    async saveLocation() {
        try {
            let location = new LecturerLocation({
                lecturerId: this.lecturerId,
                staffId: this.staffId,
                courseId: this.courseId,
                courseCode: this.courseCode,
                location: this.location,
                date: this.date
            })

            if (await location.save()) {
                return [true, location]
            }

        } catch (error) {
            return [false, translateError(error)]
        }
    }

    async findById(id) {
        try {
            const location = await LecturerLocation.findById(id);
            if (location) {
                return [true, location]
            } else {
                return [false, "Location never captured."]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    async findForCourse(courseCode) {
        const locations = await LecturerLocation.find({ courseCode });
        if (locations) {
            return [true, locations]
        } else {
            return [false, "Location(s) never captured"]
        }
    }

    async findByLecturerStaffId(staffId) {
        const locations = await LecturerLocation.find({ staffId });
        if (locations) {
            return [true, locations]
        } else {
            return [false, "Location(s) never captured"]
        }
    }

    async findByStaffIdAndCourseCode(staffId, courseCode) {
        const locations = await LecturerLocation.find({ staffId, courseCode })
        if (locations) {
            return [true, locations]
        } else {
            return [false, "Location(s) never captured"]
        }
    }

    async findByLecturerIdAndCourseId(lecturerId, courseId) {
        try {
            const locations = await LecturerLocation.find({ lecturerId, courseId });
            if (locations) {
                return [true, locations]
            } else {
                return [false, "Location(s) never captured"]
            }

        } catch (error) {
            return [false, translateError]
        }
    }

    async getByLIdCIdAndDate(lecturerId, courseId, date) {
        try {
            // const locations = await LecturerLocation.findOne({lecturerId, courseId, date});
            const locations = await LecturerLocation.find({ lecturerId, courseId, date });
            if (locations) {
                return [true, locations]
            } else {
                return [false, "Location(s) never captured"]
            }

        } catch (error) {
            return [false, translateError]
        }
    }

    async findByLectIdLocAndCourseId(lecturerId, courseId, location) {
        try {

            const locations = await LecturerLocation.find({ lecturerId, courseId, location });
            if (locations) {
                return [true, locations]
            } else {
                return [false, "Location(s) never captured"]
            }

        } catch (error) {
            return [false, translateError]
        }
    }

}

module.exports = {
    AttendanceClass,
    LecturerLocationClass
}