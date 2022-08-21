    // require('dotenv').config();
const nodemailer = require("nodemailer");

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

    let mail;
    if(role == 'student') {
        mail= {
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
                    <p> NB: After signing in, you can update your password to something you can easily remember. </p>
                    <p> Have a wonderful day!</p>
                </div>
          
              `,
          };
      
    } else {
        mail= {
            from: nodeMailerEmail,
            to: email,
            subject: "BU Attendance Management System Login Details",
            html: `
                <div>
                    Dear Lecturer <strong>${fullName}</strong>,
                    <p>You have been successfully added to the BU Attendance management system. This system shall allow you to manage and track attendance for all your courses and students in a semester.</p>
                    <p>Find attached below your login details. </p> 
                    <p> Id number (Staff ID) - ${idNum}, Password - ${password} </p>
                    <p> NB: After signing in, you can update your password to something you can easily remember.</p>
                    <p> Have a wonderful day!</p>
                </div>
          
              `,
          };
    }
  
    const result = await transporter.sendMail(mail);
    console.log("The result from sending ", result);

    if (result.accepted) {
      return [true, "User Welcome mail sent successfully."];
    } else {
      return [
        false,
        result.code,
        "Something went wrong in sending welcome mail to user.",
      ];
    }
  } catch (error) {
    console.log(error);
    return [
      false,
      error,
      "Something went wrong in sending Welcome mail to user.",
    ];
  }
};

module.exports = { sendLoginDetailsMail };
