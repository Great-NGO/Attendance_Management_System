require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../model/user")

/* */
class UserClass{
    constructor(idNum, firstname, lastname, password, role) {
        this.idNum = idNum;
        this.firstname = firstname;
        this.lastname = lastname;
        this.password = password;
        this.role = role;
        
    }

    getUserFullName(){
        return `${this.firstname} ${this.lastname}`
    }

    async login(idNum, password, role){
        const user = await User.findOne({idNum});

        if(user && user.validPassword(password)){
            return [true, user, `${{role}.toUpperCase()} login `]
        } else {
            return [false, "Invalid ID or Password"]
        }

    }
   
    // logout(){
    //     return `${this.name} has logged out successfully`
    // }

}

module.exports = {
    UserClass
}

