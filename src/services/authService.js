const validator = require("validator");
const User = require("../models/user");
const { USER_PROFILE_DATA } = require("../utils/constant");
const loginUser = async({ emailId, password }) => {
    if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }

  const user = await User.findOne({ emailId })
  .populate(USER_PROFILE_DATA)

  if (!user) {
    throw new Error("Email and password do not match");
  }

  const isPasswordValid = await user.validatePassword(password);

  if (!isPasswordValid) {
    throw new Error("Password is not valid");
  }

  const token = await user.getJWT();

  return {user, token};
}

module.exports = {
  loginUser,
}