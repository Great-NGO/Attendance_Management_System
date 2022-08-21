require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../model/user");
const { translateError } = require('../utils/mongo_helper');
const { encryptPassword } = require('../utils/password');

/* BASE USER CLASS */
class UserClass{
    constructor(idNum, firstname, lastname, email, password, role) {
        this.idNum = idNum;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.role = role;
        
    }

    async register() {
        try {
            let user = new User({
                firstname: this.firstname,
                lastname: this.lastname,
                idNum: this.idNum,
                email: this.email,
                password: await encryptPassword(this.password),
                role: this.role

            })
            
            if(await user.save()) {
                return [ true, user]
            } 

        } catch (error) {
            return [false, translateError(error)]
        }
    }
 
    async authenticateUser(idNum, password, role){
        const user = await User.findOne({idNum, role});
        console.log("USer ", user)

        if(user){
            // console.log(await user.validPassword(password))
            if(await user.validPassword(password)){
                const returnedUser = user;
                returnedUser.password = undefined; 
                return [true, returnedUser, await this.generateAccessToken(idNum, returnedUser._id, role)]
            } else {
                return [false, "Incorrect password"]
            }
            
        } else {
            if(role == "admin" || role == "lecturer" || role == "student") {
                return [false, `${role.charAt(0).toUpperCase()+role.slice(1)} with Id number does not exist` ]
            } else {
                return [false, "User with Id and role does not exist."]
            }
        }

    }

    async generateAccessToken(id, user_id, role) {
        return jwt.sign({id, user_id, role}, process.env.JWT_SECRET, {expiresIn: '2h'})
    }

    getUserFullName(){
        return `${this.firstname} ${this.lastname}`
    }

    async getById(idNum){
        const user = await User.findOne({idNum});
        if(user) {
            return [true, user]
        } else {
            return [false, "User with idNum doesn't exist"]
        }
    }

    async update(fields) {
        try {
            const user = await this.getById(this.idNum);
            if(user[0] !== false) {
                const updatedUser = await User.findByIdAndUpdate(user[1]._id, fields)
                if(updatedUser){
                    return [ true, updatedUser, "Update successful"]
                }  else{
                    return [ false, "Failed to update user"]
                }
            } else{
                return [false, "User does not exist"]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
  
    }

    async delete() {
        try {
            const user = await this.getById(this.idNum);
            console.log("USERRR ", user)
            if(user[0] !== false) {
                const deletedUser = await User.findByIdAndDelete(user[1]._id);
                if(deletedUser) {
                    return [ true, deletedUser, "User deleted successfully."]
                } else{
                    return [false, "Failed to delete user"]
                }
    
            } else {
                return [false, "User does not exist"]
            }
        } catch (error) {
            return [false, translateError(error)]
        }

    }

    async getByDBId(id) {
        try {
            const user = await User.findById(id);
            if(user) {
                return [true, user]
            } else {
                return [false, "User does not exist"]
            }
        } catch (error) {
            return [false, translateError(error)]
        }
    }

    async getByEmail(email){
        const user = await User.findOne({email});
        if(user) {
            return [true, user]
        } else {
            return [false, "User with email doesn't exist"]
        }
    }

    static async getAllStudents(){
        const students = await User.find({role: "student"});
        return students
    }

}

module.exports = {
    UserClass
}

