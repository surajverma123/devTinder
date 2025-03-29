const validator  = require("validator");

const validateSignupData = (req) => {
    console.log("======= INSIDE VALIDATOR FUNCTION")
    const { firstName,lastName,emailId, password} = req.body;
    if (!firstName||!lastName ) {
        throw new Error("Name is not valid")
    } else if (firstName.length < 4 || firstName > 50) {
        throw new Error("first Name should be 4 to 50character");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("please enter a strong password");
    }
}

const validateProfileEditData = (req) => {
    const { age, gender, photoUrl, skills} = req.body;
    const allowedEditFields = ["firstName", "lastName", "emailId", "photoUrl", "age", "gender","about", "skills"];
    
    const isAllowEdit = Object.keys(req.body).every(key => allowedEditFields.includes(key));
    
    return isAllowEdit;
}

module.exports = { validateSignupData }