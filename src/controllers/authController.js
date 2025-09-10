const bcrypt = require('bcrypt');

const User = require('../models/user');
const { generateOTP, run } = require('../utils/sendEmail');
const Otp = require('../models/otp');
const { loginUser, signupUser, forgotPassword, resetPassword } = require('../services/authService');

const userLogin = async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const { token, user } = await loginUser({ emailId, password });
    // This cookie will expire in 8h
    res.cookie('token', token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.status(200).send({
      status: 200,
      message: 'User login successfull',
      user
    });
  } catch (error) {
    res.status(403).json({
      message: error.message,
    });
  }
};
const userSignup = async (req, res) => {
  try {
    const {
      fullName,
      emailId,
      dob,
      age,
      caste,
      gender,
      password,
      confirmPassword,
    } = req.body;

    const savedUser = await signupUser({
      fullName,
      emailId,
      dob,
      age,
      caste,
      gender,
      password,
      confirmPassword
    });
    
    res.status(201).json({
      message: 'User added successfully',
      user: savedUser,
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

const userForgotPassword = async (req, res) => {
  try {
    const { emailId: email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: 'Email is required',
        success: false,
        status: 400,
      });
    }

    await forgotPassword({ email });

    return res.status(200).json({
      message: 'OTP sent successfully',
      success: true,
      status: 200,
    });
  } catch (err) {
    console.error('Error in OTP handler:', err);
    res.status(500).json({
      message: 'Failed to send OTP',
      success: false,
      status: 500,
      error: err.message,
    });
  }
};

const userResetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    await resetPassword({ email, otp, password });
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Password has been updated, you can now log in',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong',
      success: false,
      status: error.statusCode || 500,
      error: error.message,
    });
  }
};
module.exports = {
  userLogin,
  userSignup,
  userForgotPassword,
  userResetPassword,
};
