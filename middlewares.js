const jwt = require("jsonwebtoken");

const isLoggedInMiddleware = (req,res,next) => {
    const token = req.header("auth-token");

    // when there is not token
    if(!token) {
        return res.status(401).send("access denied log in first");
    }

    // retriving token data in jwt
    try {

        const verifiedUser = jwt.verify(token,process.env.TOKEN_SECRET);
        req.user = verifiedUser;
        next();

    }catch(err) {
        res.status(400).send("Invalid Token")
    }

}

module.exports = {
    isLoggedInMiddleware:isLoggedInMiddleware
}