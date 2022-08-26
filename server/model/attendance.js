const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const AttendanceSchema = new Schema(
  {
    courseId: { type: ObjectId, required: true, ref: "course" },
    courseCode: { type: String, required: true },
    studentId: { type: ObjectId, required: true, ref: "user" },
    studentName: { type: String },
    studentMatricNo: { type: String, required: true },
    studentPicture: { type: String, required: true},
    studentLocation: { type: String, required: true },
    semester: { type: String},
    session: { type: String},
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const lecturerLocationSchema = new Schema({
  lecturerId: { type: ObjectId, required: true, ref: "user" },
  staffId: { type: String, required: true },
  courseId: { type: ObjectId, required: true, ref: "course" },
  courseCode: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: Date, default: Date.now },
}, {timestamps: true});

const Attendance = mongoose.model("Attendance", AttendanceSchema);
const LecturerLocation = mongoose.model("LecturerLocation", lecturerLocationSchema)

module.exports = { 
  Attendance,
  LecturerLocation
};
