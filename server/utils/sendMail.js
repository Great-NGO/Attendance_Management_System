require("dotenv").config();
const nodemailer = require("nodemailer");
const { logError } = require("./logging");

const nodeMailerEmail = process.env.NODEMAILER_USER_EMAIL;
const nodeMailerPassword = process.env.NODEMAILER_USER_PASSWORD;

console.log(nodeMailerEmail);
console.log(nodeMailerPassword);

const sendLoginDetailsMail = async (email, fullName, idNum, password, role) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodeMailerEmail,
        pass: nodeMailerPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    if (process.env.NODE_ENV === "production") {
      url = "https://buattendancemanagementsystem.herokuapp.com/login";
    } else {
      url = `http://localhost:4000/login`;
    }

    let mail;
    if (role == "student") {
      mail = {
        from: nodeMailerEmail,
        to: email,
        subject: "BU Attendance Management System Login Details",
        html: `
                <div>
                    Dear Student <strong>${fullName}</strong>,
                    <p>You have been successfully added to the BU Attendance management system. This system shall allow you to submit and track attendance for all your courses in a semester.  </p>
                    <p>The system and your attendance for a course is mainly managed by your lecturer. So feel free to contact him/her if you experience any issue in using this system or send a complaint to this email. </p>
                    <p>Finally, find attached below your login details. </p> 
                    <p> Id number (Matric no) - ${idNum}, Password - ${password} </p>
                    <a href="${url}">Click here to login</a>
                    <p> NB: After signing in, you can update your password to something you can easily remember. </p>
                    <p> Have a wonderful day!</p>
                </div>
          
              `,
      };
    } else {
      mail = {
        from: nodeMailerEmail,
        to: email,
        subject: "BU Attendance Management System Login Details",
        html: `
                <div>
                    Dear Lecturer <strong>${fullName}</strong>,
                    <p>You have been successfully added to the BU Attendance management system. This system shall allow you to manage and track attendance for all your courses and students in a semester.</p>
                    <p>Find attached below your login details. </p> 
                    <p> Id number (Staff ID) - ${idNum}, Password - ${password} </p>
                    <a href="${url}">Click here to login</a>
                    <p> NB: After signing in, you can update your password to something you can easily remember.</p>
                    <p> Have a wonderful day!</p>
                </div>
          
              `,
      };
    }

    const result = await transporter.sendMail(mail);
    console.log("The result from sending ", result);

    if (result.accepted) {
      return [true, "Login Details mail sent to user successfully."];
    } else {
      return [
        false,
        result.code,
        "Something went wrong in sending mail to user.",
      ];
    }
  } catch (error) {
    logError(error);
    return [false, error, "Something went wrong in sending mail to user."];
  }
};

const sendResetPwdMail = async (email, fullName, id, role) => {
  try {
    let url1;
    let url2;

    if (process.env.NODE_ENV === "production") {
      url1 = `https://buattendancemanagementsystem.herokuapp.com/resetPassword/${id}`;
      url2 = `https://buattendancemanagementsystem.herokuapp.com/admin/resetPassword/${id}`;
    } else {
      url1 = `http://localhost:4000/resetPassword/${id}`;
      url2 = `http://localhost:4000/admin/resetPassword/${id}`;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: nodeMailerEmail,
        pass: nodeMailerPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    let mail;
    if (role === "student") {
      mail = {
        from: nodeMailerEmail,
        to: email,
        subject: "Reset your password",
        html: `
             Dear Student <strong>${fullName}</strong>,
             <p>Having an issue with remembering your password? Well don't worry! </p>
             <p>Click the link below to complete your password reset process </p>
             <br> <a href="${url1}">Click here to reset your password</a>
          `,
      };
    } else if (role === "lecturer") {
      mail = {
        from: nodeMailerEmail,
        to: email,
        subject: "Reset your password",
        html: `
             Dear Lecturer <strong>${fullName}</strong>,
             <p>Having an issue with remembering your password? Well don't worry! </p>
             <p>Click the link below to complete your password reset process </p>
             <br> <a href="${url1}">Click here to reset your password</a>
          `,
      };
    } else {
      mail = {
        from: nodeMailerEmail,
        to: email,
        subject: "Reset your password",
        html: `
             Dear Admin <strong>${fullName}</strong>,
             <p>Click the link below to complete your password reset process </p>
             <br> <a href="${url2}">Click here to reset your password</a>
          `,
      };
    }

    const result = await transporter.sendMail(mail);
    console.log("helo");
    console.log("The result ", result);
    if (result.accepted) {
      return [true, "Reset Password link sent successfully."];
    } else {
      return [
        false,
        result.code,
        "Something went wrong in sending reset password link",
      ];
    }
  } catch (error) {
    console.log(error);
    return [
      false,
      error,
      "Something went wrong in sending reset password link",
    ];
  }
};

module.exports = { sendLoginDetailsMail, sendResetPwdMail };
