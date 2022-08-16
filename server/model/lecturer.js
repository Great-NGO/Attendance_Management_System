// Import the mongoose module
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const LecturerSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  staffID: { type: String, required: true, unique: true },  //Staff ID for lecturers
  role: { type: String, default: "lecturer" },
//   department: { type: String},
  // token: { type: String},

}, {timestamps: true});

const Lecturer = mongoose.model("Lecturer", StudentSchema)

module.exports = Lecturer;
