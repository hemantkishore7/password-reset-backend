require("dotenv").config()
const express = require("express");
const connectDb = require("./config/db")
const cors = require("cors");

//To connect DB
connectDb();

const app = express();

app.use(express.json());
app.use(cors());

// Importing the routes
const authRoute = require("./routes/auth.route")
const userRoute = require("./routes/user.route")
const passwordReset = require("./routes/passwordReset.route")

//Adding the custom middleware
app.use("/api", userRoute);
app.use("/api", authRoute);
app.use("/api", passwordReset);



app.get("/",(req,res)=>{
    res.status(200).send("Welcome to Password-Reset application")
})

//Initializing the port number
const port = process.env.PORT || 6000;

app.listen(port,()=>{
    console.log(`Application is running on PORT ${port}`);
})