const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const CourseSchema = new Schema({
  taughtBy: {
    lecturerId: {
      type: ObjectId,
      ref: "user",
      required: true,
    },
    lecturerName: {
      type: String,
      // required: true
    },
    staffId: {
      type: String,
    },
  }, //Lecturer
  courseTitle: { type: String, required: true },
  courseCode: {
    type: String,
    required: true,
    unique: true,
  },
  courseDepartment: { type: String, required: true },
  takenBy: [
    {
      studentId: {
        type: ObjectId,
        ref: "user",
      },
      studentName: {
        type: String,
        // required: true,
      },
      studentMatricNo: {
        type: String,
        // required: true,
        // unique: true,
      },
      studentLevel: {
        type: Number,
      },
      attendance: [
        {
          studentPicture: {
            //For student image upload
            type: String,
          },
          studentLocation: { type: String },
          isPresent: { type: Boolean },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      incrementattendanceScore: {  //Would update this score based on the attendance collection
        type: Number,
        default: 0,
      },
      attendanceScore: {    //student attendance score
        type: Number
      },
      _id: false,
    },
  ],
  //
  // attendance: [
  //   {
  //     studentName: {
  //       type: String,
  //     },
  //     studentMatricNo: {
  //       type: String,
  //     },
  //     studentPicture: [
  //       {
  //         type: String,
  //       },
  //     ],
  //     studentLocation: [{ type: String }],
  //     isPresent: [{ type: Boolean }],
  //     attendanceScore: {
  //       type: Number,
  //       default: 0,
  //       min: [0, "Attendance Score can not be less than 0"],
  //     },
  //     date: {
  //       type: Date,
  //       default: Date.now
  //     },
  //     hasSubmitted: {
  //       type: Boolean,
  //       default: false
  //     },
  //     _id: false
  //   },
  // ],
  // lecturerLocation: [{ type: String }], //To capture location of lecturer each time an attendance is opened for capturing
  canSubmitAttendance: {
    //Property to allow students to be able to submit attendance or not
    type: Boolean,
    default: false,
  },
  attendanceNum: {
    type: Number,
    // required: true,
    // default: 1,
    default: 10, //Would change the value later
    min: [1, "Attendance for course must be taken at least one time"],
  },
  // Course would have a semester it belongs to and a session.
  semester: {
    type: String,
  },
  session: {
    type: String,
  },
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
