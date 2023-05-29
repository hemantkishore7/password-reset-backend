const userRoute = require("express").Router()
const {User,validate} = require("../model/user.model")
const bcrypt = require("bcrypt");

//Sign-Up
userRoute.post("/signup",async(req,res)=>{
    try {
        const {error} = validate(req.body);
        if(error){return res.status(400).send({
            message: error.details[0].message,
        })}

        let user = await User.findOne({email:req.body.email})
        if(user){
            return res.status(400).send({
                message:"User already have a account",
            })
        }

        const salt = 10;
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        console.log("hashPassword", hashPassword);

        user = await new User({...req.body,password:hashPassword}).save();

        return res.status(200).send({
            data:user,
        })
    } catch (error) {
      console.log(error);  
    }
})


module.exports = userRoute;