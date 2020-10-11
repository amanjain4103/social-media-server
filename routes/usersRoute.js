const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const { validateSignup, validateSignin, validateEmail } = require("../validation");
const jwt = require("jsonwebtoken");

router.get("/", (req,res) => {
    res.send("hello from usersRoute")
})


// responses from signup
//      validationMessage => var having a mesaage
//      error occured while Finding Data!
//      User Email already exists, Try to signin.
//      error while encrypting password, Try again!
//      successfulSignup
//      error occured while Saving Data!
//      error occured at server! Please try again later

// signup here
router.post("/signup",(req,res) => {

    // this will handle redirect, using this way to make it more flexible
    // you can use req.body directly while posting /users/signup or use query string while redirect
    if(req.query.firstName) {
        req.body = {
            firstName: req.query.firstName,
            lastName: req.query.lastName,
            email: req.query.email,
            password: req.query.password
        }
    }

    // validation
    var validationMessage = validateSignup(req.body);
    if(validationMessage) {
        res.json({
            "message":validationMessage
        });
    }

    // hashing password
            try {
                User.findOne({email: req.body.email},"_id", (errorWhileFinding,result) => { 

                    if (errorWhileFinding){ 
                        // console.log(err)
                        // console.log("error occured while finding Data!")
                        res.json({
                            "message":"error occured while Finding Data!"
                        });
                    } 
                    
                    if(result) { 
                        // console.log(result)
                        res.json({
                            "message":"User Email already exists, Try to signin."
                        });
                
                    }else {
                        // the flow comes here when no user found for the provided data, so now we can create a new user


                        //hashing password
                        bcrypt.hash(req.body.password, 10, (errorWhileEncypting, hashedPassword)=> {
                            if(errorWhileEncypting) {
                                res.json({
                                    "message":"error while encrypting password, Try again!"
                                });
                            }else {
                                //password is successfully hashed now
                            
                                // creating a new user
                                const newUser = new User({
                                    firstName: req.body.firstName,
                                    lastName: req.body.lastName,
                                    email: req.body.email,
                                    password: hashedPassword,
                                    avatarSrc: "https://static.thenounproject.com/png/363640-200.png"
                                    
                                })

                                newUser.save((errorWHileSaving,doc) => {
                                    if(doc) {
                                        // console.log(doc);
                                        res.json({
                                            "message":"successfulSignup"
                                        });
                                    }else {
                                        // console.log(errorWHileSaving)
                                        // console.log("error occured while Saving Data!")
                                        res.json({
                                            "message":"error occured while Saving Data!"
                                        });
                                    }
                                })
    
                            }
                        })

                    }


                })

            }catch(error) {
                // console.log(error);
                res.json({
                    "message":"error occured at server! Please try again later"
                });
            }

})

router.post("/signin",(req,res) => {
    
    // validation on req data
    var validationMessage = validateSignin(req.body);
    
    if(validationMessage) {
        res.json({
            "message":validationMessage
        });
        
    }

    try {

        User.findOne({"email":req.body.email},(errorWhileFinding,userData) => {
            
            if(errorWhileFinding) {
                // console.log("Can't compare with database right now! Please try again later");
                res.json({
                    "message":"Can't compare with database right now! Please try again later"
                });
            }else if(userData) {

                if(userData!==null) {
                    if(userData!=="") {

                        // comparing passwords
                        bcrypt.compare(req.body.password, userData.password, (errorWhileMatching, isMatch) => {
                            
                            if(errorWhileMatching) {
                                // console.log(errorWhileMatching);
                                // console.log("error while matching passwords using bcrypt");
                                res.json({
                                    "message":"Error while matching passwords in database"
                                });
                            }else if(isMatch) {

                                // generating auth-token using jwt which expires in 86400seconds/24hours
                                const token = jwt.sign({ email: userData.email },process.env.TOKEN_SECRET,{expiresIn: 86400});

                                // password matched hence the user authentication successful 
                                // console.log(userData);
                                
                                res.header("auth-token",token).json({
                                    "message":"successfulSignin",
                                    "authToken":token,
                                    "firstName":userData.firstName,
                                    "lastName":userData.lastName,
                                    "email":userData.email,
                                    "avatarSrc":userData.avatarSrc,
                                    "numberOfPosts":userData.numberOfPosts,
                                    "numberOfLikes":userData.numberOfLikes
                                    
                                });
                                
                            }else {

                                // email exists but password doen't match
                                res.json({
                                    "message":"Password doesn't match! Check your password again"
                                });
                            }

                        } )

                    }else {
                        res.json({
                            "message":"The user Doesn't exists or Email is wrong! Try Again"
                        });
                    }
                }else {
                    res.json({
                        "message":"The user Doesn't exists or Email is wrong! Try Again"
                    });
                }
 
            }else {
                res.json({
                    "message":"The user Doesn't exists or Email is wrong! Try Again"
                });
            }
        })

    }catch(error) {
        console.log(error);
        res.json({
            "message":"Some error occured on server"
        });
    }
})

router.get("/getuser", (req,res) => {
    
    console.log(req.query);
    
    // validation
    var validationMessage = validateEmail(req.query);
    if(validationMessage) {
        res.json({
            "message":validationMessage
        });
    }
    
    const userEmail = req.query.email;

    // start

    try {

        User.findOne({"email":userEmail},(errorWhileFinding,userData) => {
            
            if(errorWhileFinding) {
                // console.log("Can't compare with database right now! Please try again later");
                res.json({
                    "message":"Can't compare with database right now! Please try again later"
                });
            }else if(userData) {

                if(userData!==null) {
                    if(userData!=="") {

                        res.json({
                            "message":"userDataFound",
                            "firstName":userData.firstName,
                            "lastName":userData.lastName,
                            "email":userData.email,
                            "avatarSrc":userData.avatarSrc,
                            "numberOfPosts":userData.numberOfPosts,
                            "numberOfLikes":userData.numberOfLikes,
                            "posts":userData.posts
                            
                        });

                    }else {
                        res.json({
                            "message":"The user Doesn't exists or Email is wrong! Try Again"
                        });
                    }
                }else {
                    res.json({
                        "message":"The user Doesn't exists or Email is wrong! Try Again"
                    });
                }
 
            }else {
                res.json({
                    "message":"The user Doesn't exists or Email is wrong! Try Again"
                });
            }
        })

    }catch(error) {
        console.log(error);
        res.json({
            "message":"Some error occured on server"
        });
    }

    // end
    
})









module.exports = router;