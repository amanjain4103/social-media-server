const router = require("express").Router();
const { isLoggedInMiddleware } = require("../middlewares");
const User = require("../model/User");
const formidable = require("formidable");
const Feed = require("../model/Feed");

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



router.post("/upload", isLoggedInMiddleware, (req,res) => {

    let newFeed = new Feed({
        "email":req.body.email,
        "postSrc":req.body.postSrc,
        "avatarSrc":req.body.avatarSrc,
        "caption":req.body.caption,
        "likes":[],
        "comments":[]
    })

    console.log(req.body);

    try {
 
        newFeed.save((errorWhileUploading,doc) => {
            console.log("hello")
            if(errorWhileUploading) {
                res.json({
                    "message":"error while adding info to db"
                })
            }else {
                if(doc!==null) {
                    if(doc!=="") {

                        // now also upload on myposts section of user 
                        User.findOneAndUpdate({"email":req.body.email},{ $push: { posts: newFeed } }, (error,doc) => {
                            if(error) {
                                res.json({
                                    "message":"error while adding info to db"
                                })
                            }else {
                                if(doc!==null) {
                                    if(doc!=="") {
                                        res.json({
                                            "message":"uploadedSuccessfully"
                                        })
                                    }else {
                                        res.json({
                                            "message":"Something went wrong with db!"
                                        })
                                    }
                                }else {
                                    res.json({
                                        "message":"Something went wrong with db!"
                                    })
                                }
                            }
                            
                        })

                    }else {
                        res.json({
                            "message":"file not uploaded Please try again later!!!"
                        })
                    }
                }else {
                    res.json({
                        "message":"file not uploaded Please try again later!!!"
                    })
                }
            }
        })
    }catch(err) {
        req.json({
            "message":"Some Problem From Our side, Please Try Again!!!"
        })
    }
    

})

router.get("/feeds",isLoggedInMiddleware, (req,res) => {

    try {
    
        Feed.find({}, (errorWhileFindingFeeds, feeds) => {
            if(errorWhileFindingFeeds) {
                res.json({
                    "message":"We unfortunately met an unusual error but keep trying!!!"
                })
            }else {
                if(feeds!==null) {
                    if(feeds!=="") {
                        res.json({
                            "message":"feedsFetchedSuccessfully",
                            "feeds":feeds
                        })
                    }else {
                        res.json({
                            "message":"There are no feeds present!"
                        })
                    }
                }else {
                    res.json({
                        "message":"There are no feeds present!"
                    })
                }
            }
        })
        
    }catch(err) {
        req.json({
            "message":"Some Problem From Our side, Please Try Again!!!"
        })
    }

})

router.post("/upload-profile-avatar", isLoggedInMiddleware, (req,res) => {

    console.log(req.body);
    console.log(req.user.email);

    try {

        User.findOneAndUpdate({"email":req.user.email},{$set : { avatarSrc: req.body.avatarSrc }}, (errorWhileUpdatingAvatar,doc)=> {
            if(errorWhileUpdatingAvatar) {
                res.json({
                    "message":"Error occured while updating new Avatar for the user!!!"
                })
            }else {
                if(doc!==null) {
                    if(doc!=="") {
                        res.json({
                            "message":"avatarUpdatedSuccessfully"
                        })
                    }else {
                        res.json({
                            "message":"Something went Wrong with credentials!!!"
                        })
                    }
                }else {
                    res.json({
                        "message":"Something went Wrong with credentials!!!"
                    })
                }
            }
        })

    }catch(err) {
        req.json({
            "message":"Some Problem From Our side, Please Try Again!!!"
        })
    }

})

router.put("/likes",(req,res) => {
    

    if(req.body.likeToBeAdded) {
        
        Feed.findOneAndUpdate({"_id":req.body.feedId},{$addToSet: {"likes":req.body.emailToBeManipulated}},(errorWhileAddingLike,doc) => {
            if(errorWhileAddingLike) {
                res.json({
                    "message":"Invalid credentials!!!"
                })
            }else {
                if(doc!==null) {
                    if(doc!=="") {

                        // I must got my searched feed and it must be updated now
                        res.json({
                            "message":"likeAddedSuccessfully"
                        })
                    }else {
                        res.json({
                            "message":"No such data is associated with provided Credentials!!!"
                        })
                    }
                }else {
                    res.json({
                        "message":"No such data is associated with provided Credentials!!!"
                    })
                }
            }
        })

    }else if(!req.body.likeToBeAdded) {
        Feed.findOneAndUpdate({"_id":req.body.feedId},{$pull: {"likes":req.body.emailToBeManipulated}},(errorWhileDeletingLike,doc) => {
            if(errorWhileDeletingLike) {
                res.json({
                    "message":"Invalid credentials!!!"
                })
            }else {
                if(doc!==null) {
                    if(doc!=="") {

                        // I must got my searched feed and it must be updated now
                        res.json({
                            "message":"likeDeletedSuccessfully"
                        })
                    }else {
                        res.json({
                            "message":"No such data is associated with provided Credentials!!!"
                        })
                    }
                }else {
                    res.json({
                        "message":"No such data is associated with provided Credentials!!!"
                    })
                }
            }
        })
    }


})

router.post("/add-comment",isLoggedInMiddleware, (req,res) => {
    // res.json(req.body);

    Feed.findOneAndUpdate({"_id":req.body.feedId}, {$push: {"comments":{"email":req.body.email, "message":req.body.message}}}, (errorWhileAddingComment, doc) => {
        if(errorWhileAddingComment) {
            res.json({
                "message":"Something Went Wrong While adding to comment, try Again!!!"
            })
        }else {
            if(doc!==null) {
                if(doc!=="") {

                    res.json({
                        "message":"commentAddedSuccessfully"
                    })

                }else {
                    res.json({
                        "message":"Can't Fetch Current Post!!!"
                    })
                }
            }else {
                res.json({
                    "message":"Can't Fetch Current Post!!!"
                })
            }
        }
    })
})
module.exports = router;