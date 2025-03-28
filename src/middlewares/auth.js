const jwt = require("jsonwebtoken");
const User = require("../models/user");
const adminAuth = (req, res, next) => {};

const userAuth = async (req, res, next) => {
  try {
     // Readthe token req cookies
  const { token } = req.cookies;
  if (!token) {
    throw new Error("Token is required, Please login")
  }
  // validate the token
  const decodedObj = jwt.verify(token, "DEV@Tinder123#");
  // find the user

  const { _id } = decodedObj;

  const user = await User.findById(_id);

  if (!user) {
    throw new Error("Invalid User, you can not access")
  }
  req.user = user;
  next();
  } catch(error) {
    res.status(400).send("Error: " + error.message);
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
