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

    async login(idNum, password, role){
        const user = await User.findOne({idNum});

        if(user && user.validPassword(password)){
            // return [true, user, `${{role}.toUpperCase()} login `]
            return [true, user, `${role.toUpperCase()} login `]
        } else {
            return [false, "Invalid ID or Password"]
        }

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
   
    // logout(){
    //     return `${this.name} has logged out successfully`
    // }

}

module.exports = {
    UserClass
}

