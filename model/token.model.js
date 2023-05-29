const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Types.ObjectId,
        required: true,
        unique: true,
        ref: "user",
    },
    token:{
        type:String,
        required:true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
        expires: 10000,
    }
})

module.exports = mongoose.model("token",tokenSchema)