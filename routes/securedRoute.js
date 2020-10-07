const router = require("express").Router();
const { isLoggedInMiddleware } = require("../middlewares");

router.get("/",isLoggedInMiddleware,(req,res) => {
    console.log("hello world");
    res.send("welcome to private route");
})

module.exports = router;