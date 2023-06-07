const passwordResetRoute = require("express").Router();
const Joi = require("joi");
const { User } = require("../model/user.model");
const Token = require("../model/token.model");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");
const passwordComplexity = require("joi-password-complexity");
const bcrypt = require("bcrypt");

//Send password Link
passwordResetRoute.post("/password-reset", async (req, res) => {
  try {
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("Email"),
    });
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(200).send({
        message: error.details[0].message,
      });
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({
        message: "User given email id is does not exist",
      });
    }

    let token = await Token.findOne({ userId: user._id });
    console.log("Token", token);

    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const url = `http://localhost:3000/reset/${user._id}/${token.token}/`;
    // http://localhost:3000/reset
    await sendMail(user.email, "Password Reset", url);
    res.status(200).send({
      message: "Password reset link sent to your email account",
    });
    //console.log(url);
  } catch (error) {
    console.log(error);
  }
});

//Verify the URL
passwordResetRoute.get("/password-reset/:id/:token",async(req,res)=>{
    try {
        const user = await User.findOne({_id:req.params.id})
        if(!user){
          return res.status(400).send({
            message:"INVALID LINK"
          })
        }
        const token = await Token.findOne({
          userId:user._id,
          token:req.params.token,
        })
        if(!token){
          return res.status(400).send({
            message:"INVAKID LINK",
          })
        }
        res.status(200).send("valid url")

    } catch (error) {
        console.log(error);
    }
})

//Reset password
passwordResetRoute.post("/password-reset/:id/:token",async(req,res)=>{
  try {
    const passwordSchema = Joi.object({
      password : passwordComplexity().required().label("Password")
    });

    const {error} = passwordSchema.validate(req.body);
    if(error){
      return res.status(400).send({
        message: error.details[0].message
      })
    }

    const user = await User.findOne({_id:req.params.id})
    if(!user){
      return res.status(400).send({
        message:"Invalid Link"
      })
    }

    const token = await Token.findOne({
      userId:user._id,
      token:req.params.token,
    })

    if(!token){
      return res.status(400).send({
        message:"Invalid Link"
      })
    }

    const salt = 10;
    const hashPassword = await bcrypt.hash(req.body.password, salt)
   
    user.password = hashPassword;
    await user.save();
    await token.deleteOne()
    res.status(200).send({
      message:"Password Reset Successfully"
    })
  } catch (error) {
    console.log(error);
  }
})

module.exports = passwordResetRoute;
