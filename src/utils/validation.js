const validator  = require('validator');

const validateSignupData = ({ fullName, emailId, password }) => {
    if (!fullName ) {
        throw new Error('Name is not valid');
    } else if (fullName.length < 4 || fullName > 50) {
        throw new Error('first Name should be 4 to 50character');
    } else if (!validator.isEmail(emailId)) {
        throw new Error('Email is not valid');
    } else if (!validator.isStrongPassword(password)) {
        throw new Error('please enter a strong password');
    }
};

const validateProfileEditData = (req) => {
    const allowedEditFields = ['fullName', 'caste', 'emailId', 'photoUrl', 'age', 'gender','about', 'skills','dob','confirmPassword'];
    
    const isAllowEdit = Object.keys(req.body).every(key => allowedEditFields.includes(key));
    
    return isAllowEdit;
};

module.exports = { validateSignupData, validateProfileEditData };

