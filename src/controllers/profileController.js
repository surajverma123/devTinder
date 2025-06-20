
const { validateProfileEditData }  = require("../utils/validation");
const User = require("../models/user");

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if(!userId) {
      throw new Error("User is not exits, please login again")
    }

    const user = await User.findById(userId);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(403).json({
      message: error.message || "Something went wrong",
      error
    })
  }
}

const updateProfile = async(req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid Edit request")
    }
    const { user: loggedInUser } = req;
  
    // Updating value with new values that provided by user
    Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
  
    await loggedInUser.save();
    res.status(201).json({
      message: "User updated successfully",
      user: loggedInUser 
    })
  } catch(error) {
    res.status(400).json({
      message: "Can't able to update profile",
      error,
    })
  } 
}

module.exports = {
  getProfile,
  updateProfile
}