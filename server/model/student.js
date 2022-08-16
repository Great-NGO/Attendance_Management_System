// Import the mongoose module
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const StudentSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  matricNum: { type: String, required: true, unique: true },  //MatricNo for students
  role: { type: String, default: "student" },
  level: { type: Number},
  department: { type: String},
  courses: [{ type: ObjectId, ref: "course"}],  //Might not be need for this
  // token: { type: String},
  studentPicture: { type: String}

}, {timestamps: true});

const Student = mongoose.model("Student", StudentSchema)

module.exports = Student;
