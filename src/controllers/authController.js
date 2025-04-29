const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignupData } = require("../utils/validation");

const userLogin = async (req, res, next) => {
    try {
      const { emailId, password } = req.body;
      // make a validator
  
      if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid");
      }
      const user = await User.findOne({ emailId });
      if (!user) {
        throw new Error("Email and password are not match");
      }
  
      const isPasswordValid = await user.validatePassword(password);
      if (isPasswordValid) {
        // Create JWTtoken
        const token = await user.getJWT();
  
        // set Cookie
        // res.cookie("token", token, { httpOnly: true});
  
        // This cookie will expire in 8h
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
        res.status(200).send("User login successfull");
      } else {
        throw new Error("password is not valid");
      }
    } catch (error) {
      res.status(403).json({
        message: error.message,
      });
    }
  }
const userSignup = async (req, res, next) => {
  try {
    // Validate the data
    validateSignupData(req);

    // Encrypt the password
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    // save to the database
    const userObj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailId: req.body.emailId,
      age: req.body.age,
      gender: req.body.gender,
      password: passwordHash,
    };

    const user = new User(userObj);
    const savedUser = await user.save();
    res.status(201).json({
      message: "User added successfully",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
}

  module.exports = {
    userLogin,
    userSignup
  }