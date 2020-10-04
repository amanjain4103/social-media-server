const router = require("express").Router();
const config = require("../config");

router.post("/post",(req,res) => {
    res.send(req.body.otp);
})

router.get("/",(req,res) => {
    res.send("hello from otp auth routes")
})

const client = require("twilio")(config.accountSID, config.authToken)

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
            .services(config.serviceID)
            .verifications
            .create({
                to: req.body.phonenumber,
                channel: req.body.channel
            }, (error) => {
                console.log(error)
                console.log(req.body.phonenumber)
                if(error) {
                    res.status(400).send(error.message)
                }
            })
            .then((data) => {
                if(data) {
                    res.status(200).send("otpSent");
                }else {
                    res.status(500).send("otpNotSent")
                }
            })
    
    }
    catch (error) {
        res.send(500).send("requestError")
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
            .services(config.serviceID)
            .verificationChecks
            .create({
                to: req.body.phonenumber,
                code: req.body.code
            }, (error) => {
                // console.log(error)
                if(error) {
                    res.status(400).send("invalidPhoneNumberOrCode")
                }
            })
            .then((data) => {
                if(data.status === "approved") {
                    res.status(200).send("otpVerified");
                }else {
                    res.status(500).send("otpNotVerified "+data)
                }
            })
            
        
    } catch (error) {
        res.send(500).send("requestError")
    }

})

//to be noted while working with twilio
//phone number => eg. +919680302306 => with a + and country code
module.exports = router;
