const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const CourseSchema = new Schema({
  taughtBy: { type: ObjectId, required: true, ref: "user" },  //Lecturer
  courseTitle: { type: String, required: true },
  courseCode: { type: String, required: true },
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
      studentPicture: {     //For student image upload
        type: String
      },
      attendanceScore: {
        type: Number,
        // required: true,
        default: 0,
        min: [0, "Attendance Score can not be less than 0"]
      }
    },
  ],
  attendanceNum: {
    type: Number,
    // required: true,
    default: 1,
    min: [1, "Attendance for course must be taken at least one time"]
  }

});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
