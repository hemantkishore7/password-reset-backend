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

    const url = `${process.env.BASE_URL}/api/password-reset/${user._id}/${token.token}/`;
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
    } catch (error) {
        console.log(error);
    }
})
module.exports = passwordResetRoute;
