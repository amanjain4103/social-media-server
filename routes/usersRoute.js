const router = require("express").Router();
const userModel = require("../model/User");

// validation
const joi = require("@hapi/joi");


const validationSchema = joi.object({
    firstName: joi.string().min(1).required(),
    lastName: joi.string().min(1).required(),
    email: joi.string().min(6).required().email() ,
    password: joi.string().min(6).required()
})

router.get("/", (req,res) => {
    res.send("hello from usersRoute")
})

// signup
// signin
// use jwt and cookies also
// 

router.post('/signup',(req,res) => {

    // validating the data
    const validation = validationSchema.validate(req.body, validationSchema);
    
    if(validation) {
        res.send(validation)
    }

    const newUser = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password
    })

    try { 
        newUser.save()
        .then((response) => {
            res.send("successful signup")
        })
        .catch((error) => {
            res.send(error)
        })
    }catch(err) {
        console.log(err)
        res.status(400).send(err)
    }
})

module.exports = router;