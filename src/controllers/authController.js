const bcrypt = require('bcrypt');

const User = require('../models/user');
const { generateOTP, run } = require('../utils/sendEmail');
const Otp = require('../models/otp');
const { loginUser, signupUser } = require('../services/authService');

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

    // Generate OTP and expiration time
    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Remove previous OTPs
    await Otp.deleteMany({ email });

    // Store new OTP
    await Otp.create({ email, code: otpCode, expiresAt });
    console.log('======== OTP ========', otpCode);
    // Send OTP Email using SES
    const subject = `Your OTP Code: ${otpCode}`;
    const body = `
      <p>This is your One-Time Password: <strong>${otpCode}</strong></p>
      <p>Please do not share it with anyone. It will expire in 5 minutes.</p>
    `;

    await run(subject, body);

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

    const record = await Otp.findOne({ email, code: otp });

    if (!record) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ message: 'OTP expired' });
    }

    //update password
    const passwordHash = await bcrypt.hash(password, 10);
    // const user = await User.findOne({ emailId: email });
    await User.updateOne(
      { emailId: email },
      { $set: { password: passwordHash } }
    );

    await Otp.deleteOne({ _id: record._id }); // OTP is single-use
    
    res.status(200).json({
      success: true,
      status: 200,
      message: 'Password has been updated, you can now log in',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Something went wrong',
      success: false,
      status: 500,
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
