const router = require("express").Router();
const dotenv = require("dotenv").config();

router.post("/post",(req,res) => {
    res.send(req.body.otp);
})

router.get("/",(req,res) => {
    res.send("hello from otp auth routes")
})

const client = require("twilio")(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN)

// /login
    // phone Number
    // channel
// /verify
    // phonenumber
    // code



// responses you can get
//      otpSent
//      otp can't be sent, Check the credentials again, if the Problem persist then may be developers limit exceeded.
//      There is a request error! Please Try Again!

//send an otp
router.post("/send",(req,res) => {
    
    // console.log(req.body);

    try {

        client
            .verify
            .services(process.env.SERVICE_ID)
            .verifications
            .create({
                to: req.body.phonenumber,
                channel: req.body.channel
            })
            .then((data) => {
                if(data) {
                    res.status(200).json({
                        "message":"otpSent"
                    });
                }else {
                    res.status(200).json({
                        "message":"otp can't be sent, Check the credentials again, if the Problem persist then may be developers limit exceeded."
                    });
                }
            })
            .catch((error) => {
                res.json({
                    "message":"Invalid Phone Number"
                })
            })
    
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            "message":"There is a request error! Please Try Again!"
        });
    }

})

// responses you can get
//      redirect responses from /users/signup
//          different messages for error and "successfulSignup" for success in creating a user
// 
//      otpNotVerified
//      requestError

// recieves and verify the otp
router.post("/verify",(req,res) => {


    try {
        
        client
            .verify
            .services(process.env.SERVICE_ID)
            .verificationChecks
            .create({
                to: req.body.phonenumber,
                code: req.body.code
            })
            .then((data) => {
                if(data.status === "approved") {
                    // otp is verified here so adding the user

                    // 307 will make a post request because /otp/verify is also post
                    //  /users/signup makes a new user and send the appropriate response  
                    console.log(req.body);
                    res.redirect(307,`/users/signup?firstName=${req.body.firstName}&lastName=${req.body.lastName}&email=${req.body.email}&password=${req.body.password}`);

                    // res.status(200).json({
                    //     "message":"otpVerified"
                    // });

                }else {
                    // console.log(data)
                    res.status(200).json({
                        "message":"Wrong Credentials! OTP not verified, create a new OTP and try again"
                    });
                }
            })
            .catch((error) => {
                res.json({
                    "message":"Wrong Credentials! OTP not verified, create a new OTP and try again"
                })
            })
            
        
    } catch (error) {
        res.status(500).json({
            "message":"There is a request error! Please Try Again!"
        });
    }

    

})

//to be noted while working with twilio
//phone number => eg. +919680302306 => with a + and country code
module.exports = router;
