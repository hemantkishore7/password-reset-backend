const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        required:"Email is mandatory"
    },
    mobile:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},process.env.SECRET_KEY,{
        expiresIn:"7d",
    })
    return token;
}

const User = mongoose.model("Users",userSchema)

const validate = (data)=>{
    const schema = Joi.object({
        name:Joi.string().required().label("Name"),
        email:Joi.string().email().label("Email"),
        mobile:Joi.string().required().label("Mobile"),
        password: passwordComplexity().required().label("Password")
    })
    return schema.validate(data)
}

console.log("Validate: ", validate);

module.exports = {User,validate}