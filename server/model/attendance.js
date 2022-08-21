const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const AttendanceSchema = new Schema({
    course: { type: ObjectId, required: true, ref: "course"},
    studentName: { type: String, required: true},
    // studentMatricNo: { type: String, required: true, unique: true},
    studentMatricNo: { type: String, required: true},
    studentPicture: { type: String}

}, {timestamps: true});

const Attendance = mongoose.model('Attendance', AttendanceSchema)

module.exports = Attendance;