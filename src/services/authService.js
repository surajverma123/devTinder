const validator = require('validator');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Otp = require('../models/otp');

const { USER_PROFILE_DATA } = require('../utils/constant');
const { validateSignupData } = require('../utils/validation');
const { generateOTP, run } = require('../utils/sendEmail');
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
 
const forgotPassword = async ({ email }) => {
  try {
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
  } catch(error) {
    throw new Error(error);
  }
};

const resetPassword = async({ email, otp, password }) => {
   const record = await Otp.findOne({ email, code: otp });

    if (!record) {
      const error = new Error('Invalid or expired OTP');
      error.statusCode = 400;
      throw error;
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      const error = new Error('OTP expired');
      error.statusCode = 400;
      throw error;
    }

    //update password
    const passwordHash = await bcrypt.hash(password, 10);
    // const user = await User.findOne({ emailId: email });
    await User.updateOne(
      { emailId: email },
      { $set: { password: passwordHash } }
    );

    await Otp.deleteOne({ _id: record._id }); // OTP is single-use
};

module.exports = {
  loginUser,
  signupUser,
  forgotPassword,
  resetPassword
};
