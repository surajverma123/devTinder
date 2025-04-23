const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const { validateSignupData } = require("../utils/validation");
const { userAuth } = require("../middlewares/auth");
const { userLogin, userSignup } = require("../controllers/auth");

const router = express.Router();

router.post("/login", userLogin );

router.post("/signup", userSignup);

router.post("/logout", async(req, res, next) => {
  // set the cookies expire
  res.cookie('token', null, { expires: new Date(Date.now())});
  res.status(200).json({ message: "Logout is successfully"});
})

module.exports = router;
