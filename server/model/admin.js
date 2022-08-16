// Import the mongoose module
const mongoose = require("mongoose");
const { Schema } = mongoose;
const { ObjectId } = Schema;

const AdminSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  password: { type: String, required: true },
  adminId: { type: String, required: true, unique: true },  //ID for Admin
  role: { type: String, default: "admin" },
  // token: { type: String},

}, {timestamps: true});

const Admin = mongoose.model("Admin", AdminSchema)

module.exports = Admin;
