// joi validation 
const joi = require("@hapi/joi");


// signup validation
const signupValidationSchema = joi.object().keys({
    firstName: joi.string().min(1).required(),
    lastName: joi.string().min(1).required(),
    email: joi.string().min(6).required().email() ,
    password: joi.string().min(6).required()
})

const validateSignup = (data) => {
    // validating the data
    const validation = signupValidationSchema.validate(data);
    
    if(validation.error) {
        return (validation.error.details[0].message);
    }
    return null;
    // returns a message or just null

}

// signin validation
const signinValidationSchema = joi.object().keys({
    email: joi.string().min(6).max(255).email().required(),
    password: joi.string().min(6).required()
})

const validateSignin = (data) => {
    let responseOnSigninValidation = signinValidationSchema.validate(data);

    if(responseOnSigninValidation.error) {
        return (responseOnSigninValidation.error.details[0].message);
    }
    return null;
    // returns a message or just null
}


module.exports = {
    validateSignup: validateSignup,
    validateSignin: validateSignin
}