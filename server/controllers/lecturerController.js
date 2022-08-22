require('dotenv').config();
const jwt = require('jsonwebtoken');
const { AdminClass } = require('../services/adminService');
const { LecturerClass} = require('../services/lecturerService');
const { log, logError, warn, info, success } = require('../utils/logging');
const { handleErrorResponse, handleSuccessResponse } = require('../utils/responseHandler');
const { sendLoginDetailsMail } = require('../utils/sendMail');

const lecturerSignup = async (req, res) => {
    try {
        const {firstname, lastname, idNum, password, role, email, department} = req.body;

        // Create new instance of LecturerClass (an object)
        let lecturerObject = new LecturerClass(idNum, firstname, lastname, password, role, email, department)
        log("Lecturer Object ", lecturerObject)
        const fullName = lecturerObject.getUserFullName()

        const lecturerExist1 = await lecturerObject.getByIdNum(idNum)
        const lecturerExist2 = await lecturerObject.getByEmail(email)

        // console.log("LEcturer exist 1", lecturerExist1)
        // console.log("LEcturer exist 2", lecturerExist2)

        if(lecturerExist1[0] !== true && lecturerExist2[0] !== true) {
            
            // Use the register() method from the new instantiated object to create a new lecturer.
            const newLecturer = await lecturerObject.register();
            success("Lecturer saved in the database", newLecturer)

            if(newLecturer[0] !== false) {
                const mail = await sendLoginDetailsMail(email, fullName, idNum, password, role )       //To send email to lecturer
                console.log("MAIL --", mail);
                if(mail[0] == true){
                    handleSuccessResponse(res, "Lecturer added successfully.", 201, { info: "Email sent to lecturer"})
                } else {
                    // handleErrorResponse(res, "Failed to send login details mail to lecturer ", 400)
                    handleSuccessResponse(res, "Lecturer added successfully", 200, {info: "Failed to send mail to lecturer"} )
                }
            } 
            else {
                handleErrorResponse(res, `Failed to add lecturer to system. ${newLecturer[1]}`, 500)
            }

        } else {
            handleErrorResponse(res, "Staff ID/Email already exists.", 403)
        }
        
    } catch (error) {
        logError(error)
        handleErrorResponse(res, 'Something went wrong! Please try again later.',500)
    }
}

const getLecturers = async (req, res) => {
    
    const lecturers = await AdminClass.getAllLecturers()
    log("All Lecturers -",lecturers);
    handleSuccessResponse(res, "", 200, {lecturers, num:lecturers.length})

}

const getLecturerById = async (req, res) => {
    const { lecturerId } = req.params;
    const lecturerObject = new LecturerClass()  //New Instance of lecturer class
    const lecturer = await lecturerObject.getById(lecturerId);
    if(lecturer[0]==true){
        let foundLecturer = lecturer[1];
        foundLecturer.password = undefined;
        handleSuccessResponse(res, `Lecturer with id Found`, 200, {lecturer:foundLecturer} )
    } else {
        handleErrorResponse(res, `Lecturer with id '${lecturerId} not found`, 404)
    }
}

const editLecturer = async(req, res) => {
    const { lecturerId } = req.params;
    const { firstname, lastname, department } = req.body;

    const lecturerInstance1 = new LecturerClass()
    const lecturer = await lecturerInstance1.getById(lecturerId);
    if(lecturer[0] == true) {
        const lecturerInstance2 = new LecturerClass(lecturer[1].idNum)
        const fields = {firstname, lastname, level, department}
        const updatedLecturer = await lecturerInstance2.update(fields);
        if(updatedLecturer[0] == true) {
            handleSuccessResponse(res, updatedLecturer[2], 200, {lecturer:updatedLecturer[1]})
        } else{
            handleErrorResponse(res, updatedLecturer[1], 400 )
        }
    } else {
        return handleErrorResponse(res, lecturer[1], 404)
    }


}

const lecturerUpdatePassword = async(req, res) => {
    const { lecturerId } = req.params;

    const { newPassword } = req.body;

    const lecturerObject = new LecturerClass()
    const updatedLecturer = await lecturerObject.updatePassword(lecturerId, newPassword, "lecturer");
    if(updatedLecturer[0] == true) {
        handleSuccessResponse(res, updatedLecturer[2], 200)
    } else {
        return handleErrorResponse(res, updatedLecturer[1], updatedLecturer[2])
    }
}

// For an admin
const deleteLecturer = async(req, res) => {
    // const { idNum } = req.params;
    const { idNum } = req.body;

    if(!idNum) {
        return handleErrorResponse(res, "Lecturer Id number(idNum) required.", 400)
    }

    const lecturerObject = new LecturerClass(idNum)
    const isdeleted = await lecturerObject.delete();

    if(isdeleted[0] == true) {
        handleSuccessResponse(res, "Lecturer deleted successfully", 200)
    } else {
        handleErrorResponse(res, `Failed to delete lecturer with Id '${idNum}'.`, isdeleted[2])
    }
}

module.exports = {
    lecturerSignup,
    getLecturers,
    getLecturerById,
    editLecturer,
    deleteLecturer,
    lecturerUpdatePassword

}