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
//      invalidPhoneNumber
//      otpSent
//      otpNotSent
//      requestError

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
                        "message":"otpNotSent"
                    });
                }
            })
    
    }
    catch (error) {
        console.log(error)
        res.status(500).json({
            "message":"requestError"
        });
    }

})

// responses you can get
//      invalidPhoneNumberOrCode
//      otpVerified
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
                    res.status(200).json({
                        "message":"otpVerified"
                    });
                }else {
                    console.log(data)
                    res.status(200).json({
                        "message":"otpNotVerified"
                    });
                }
            })
            
        
    } catch (error) {
        res.status(500).json({
            "message":"requestError"
        });
    }

})

//to be noted while working with twilio
//phone number => eg. +919680302306 => with a + and country code
module.exports = router;
