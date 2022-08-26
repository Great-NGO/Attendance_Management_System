// Import the mongoose module
const mongoose = require("mongoose");
const { comparePassword, encryptPassword } = require("../utils/password");

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    password: {
      type: String,
      required: true,
      trim: true,
      min: [8, "Password must be atleast 8 characters long"],
      max: [1024, "Password is too long"]
    },
    idNum: { type: String, required: true, unique: true }, //MatricNum for sudents/ Staff ID for Admin or Lecturer
    role: {
      type: String,
      enum: {
        values: ["admin", "lecturer", "student"],
        message: "{VALUE} is not a valid role.",
      },
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true
    },
    level: { type: Number },
    department: { type: String },
  },
  { timestamps: true }
);


// Schema methods - validPasswword to compare a users password if its valid or not 
UserSchema.methods.validPassword = async function(password){
  return await comparePassword(password, this.password)
}

const User = mongoose.model("User", UserSchema);

module.exports = User;
