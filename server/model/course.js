const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const CourseSchema = new Schema({
  // taughtBy: { type: ObjectId, required: true, ref: "user" }, //Lecturer
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
  // takenBy: [{type: ObjectId, required: true, ref: "user"}],
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
      studentLevel : {
        type: Number
      },
      _id: false
    },
  ],
  //   attendance: [{type: ObjectId, ref: "attendance"}],
  attendance: [
    {
      studentName: {
        type: String,
        // required: true,
      },
      studentMatricNo: {
        type: String,
        // required: true,
        // unique: true,
      },
      studentPicture: [
        {
          //For student image upload
          type: String,
        },
      ],
      studentLocation: [{ type: String }],
      // lecturerLocation: [{ type: String }],
      isPresent: [{ type: Boolean }],
      attendanceScore: {
        type: Number,
        // required: true,
        default: 0,
        min: [0, "Attendance Score can not be less than 0"],
      },
      _id: false
    },
  ],
  lecturerLocation: [{ type: String }],   //To capture location of lecturer each time an attendance is opened for capturing
  canSubmitAttendance: {    //Property to allow students to be able to submit attendance or not
    type: Boolean,
    default: false,
  },
  attendanceNum: {
    type: Number,
    // required: true,
    // default: 1,
    default: 10,  //Would change the value later
    min: [1, "Attendance for course must be taken at least one time"],
  },
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
