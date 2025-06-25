
const { validateProfileEditData }  = require('../utils/validation');
const { fetchProfile, updateUserProfile } = require('../services/profileService');

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const { user } = await fetchProfile({ userId });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(error.statusCode || 403).json({
      message: error.message || 'Something went wrong',
      error
    });
  }
};

const updateProfile = async(req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error('Invalid Edit request');
    }
    const { user: loggedInUser, body  } = req;
    await updateUserProfile({ body,  loggedInUser });
   
    res.status(201).json({
      message: 'User updated successfully',
      user: loggedInUser 
    });
  } catch(error) {
    res.status(400).json({
      message: 'Can not able to update profile',
      error,
    });
  } 
};

module.exports = {
  getProfile,
  updateProfile
};