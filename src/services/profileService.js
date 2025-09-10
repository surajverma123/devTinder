const User = require('../models/user');

const fetchProfile = async ({ userId })=> {
  if(!userId) {
      const error = new Error('User is not exits, please login again');
      error.statusCode = 403;
      throw error;
    }
  const user = await User.findById(userId);
  return { user };
};

const updateUserProfile = async ({ body, loggedInUser }) => {
  try {
     // Updating value with new values that provided by user
    Object.keys(body).forEach((key) => loggedInUser[key] = body[key]);
    await loggedInUser.save();
  } catch(error) {
    throw error;
  }
};

module.exports = {
  fetchProfile,
  updateUserProfile,
};