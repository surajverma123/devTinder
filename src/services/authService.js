const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const { USER_PROFILE_DATA } = require('../utils/constant');
const { validateSignupData } = require('../utils/validation');
const loginUser = async ({ emailId, password }) => {
  if (!validator.isEmail(emailId)) {
    throw new Error('Email is not valid');
  }

  const user = await User.findOne({ emailId }).populate(USER_PROFILE_DATA);

  if (!user) {
    throw new Error('Email and password do not match');
  }

  const isPasswordValid = await user.validatePassword(password);

  if (!isPasswordValid) {
    throw new Error('Password is not valid');
  }

  const token = await user.getJWT();

  return { user, token };
};

const signupUser = async ({
  fullName,
  emailId,
  dob,
  age,
  caste,
  gender,
  password,
  confirmPassword,
}) => {
  try {
    // Validate the data
    validateSignupData({ fullName, emailId, password });

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    const confirmPasswordHash = await bcrypt.hash(confirmPassword, 10);

    // save to the database
    const userObj = {
      fullName,
      emailId,
      dob,
      age,
      caste,
      gender,
      password: passwordHash,
      confirmPassword: confirmPasswordHash, // TODO: Need to remove this field, no need of it
    };

    const user = new User(userObj);
    const savedUser = await user.save();
    return savedUser;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
 
module.exports = {
  loginUser,
  signupUser,
};
