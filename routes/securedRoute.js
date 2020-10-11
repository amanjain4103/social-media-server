const router = require("express").Router();
const { isLoggedInMiddleware } = require("../middlewares");
const User = require("../model/User");

router.get("/",isLoggedInMiddleware,(req,res) => {
    console.log("hello world");
    res.send("welcome to private route");
})




router.get("/user-data",isLoggedInMiddleware,(req,res)=> {
    console.log(req.user);
    
    // got the verified user in req.user
    const userEmail = req.user.email;

    User.findOne({"email":userEmail}, "email numberOfPosts numberOfLikes firstName lastName avatarSrc posts" , (errorWhileFinding,userData)=> {
        if(errorWhileFinding) {
            // console.log("Can't compare with database right now! Please try again later");
            res.json({
                "message":"Can't compare with database right now! Please try again later"
            });
        }else if(userData) {

            console.log(userData)
            
            if(userData!==null) {
                if(userData!=="") {
                    res.json(userData);
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

        }
    })

    // res.json({
    //     "message":"info recieved"
    // });
})



router.post("/upload",isLoggedInMiddleware, (req,res) => {
    res.send("File upload in progress");
})

module.exports = router;