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
    level: { type: Number },
    department: { type: String },
    // token: { type: String},
    studentPicture: { type: String },
    // isAdmin: { type: Boolean, required: true},
    // isLecturer: { type: Boolean, required: true},
    // isStudent: { type: Boolean, required: true}
  },
  { timestamps: true }
);

// Defining set password and validate password method on the user model
// UserSchema.methods.setPassword = function(password) {
//   console.log("The password passed ", password)
//   // return await encryptPassword(password)
//   // return `Password - ${password}`
// }

// UserSchema.methods.setPassword = encryptPassword(this.password)

UserSchema.methods.stringLog = function(string) {
  console.log("Thes string ", string);
  return `A String - ${string}`
}

UserSchema.methods.validPassword = async function(password){
  return await comparePassword(password, this.password)

}

const User = mongoose.model("User", UserSchema);

module.exports = User;
