const authRoute = require("express").Router()
const {User} = require("../model/user.model")
const bcrypt = require("bcrypt");

//Sign-In
authRoute.post("/signin",async(req,res)=>{
    try {
        const{error} = req.body;
        if(error) {return res.status(400).send({
            message: error.details[0].message,
        })
    }

    const user = await User.findOne({email:req.body.email});
    if(!user){
        return res.status(400).send({
            message:"Invalid email",
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword){
        return res.status(400).send({
            message: "Invalid Password"
        });
    }

    const token = user.generateAuthToken();
    res.status(200).send({
        data:token,
        message:"sign-in successfull"
    })

    } catch (error) {
        console.log(error);
    }
})

module.exports = authRoute