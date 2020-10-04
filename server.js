const express = require("express");
const app = express();
const otpAuthRoutes = require("./routes/otpAuth");
const usersRoute = require("./routes/usersRoute");
const dotenv = require("dotenv").config();

const cors = require("cors");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");

// mongodb and mongoose
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_CONNECTION_STRING, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    },
    () => {
        console.log("connected to db!")
    }
    )

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors());
app.use(express.json());

// routes
app.use("/otp",otpAuthRoutes);
app.use("/users",usersRoute);

app.get("/",(req,res) => {
    res.status(200).send("hello world");
})

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log("server up and running");
})

// routes 
// post => /otp/send => require body with phonenumber and channel
// post => /otp/verify => requires body with phonenumber and code