const ConnectionRequest = require('../models/connectionRequest');
const { reqReceived, userConnection, userFeed } = require("../services/userService");

const User = require('../models/user');

const USER_SAFE_DATA = 'fullName firstName lastName photoUrl age gender about skills status lastSeen';

const requestReceived = async(req, res) => {
    try {
      const loggedInUser = req.user;
      const {conRequest } = await reqReceived({ loggedInUser });

      res.status(200).json({
        message: 'Data fetched successfully',
        data: conRequest,
      });
    } catch(error) {
        res.status(400).send('Error '+ error.message);
    }
};

const connections = async(req, res) => {
  try {
    const loggedInUser = req.user;
    // Suraj ==> sent ==> Akash
    // Pooja ==> sent ==> Suraj
    const data = await userConnection({ loggedInUser });
    res.json({ data });
  } catch(error) {
    res.status(400).json({
      message: `Error: ${error.message}`
    });
  }
};

const feed = async(req, res) => {
  try {
    const loggedInUser = req.user;
    const page = req.params.page || 1;
    let limit = req.params.limit || 10;
    const users = await userFeed({ page, limit, loggedInUser });

    res.json({ 
      users,
    });
  } catch(error) {
    res.status(400).json({
      message: error?.message || 'Some thing went wrong'
    });
  }
};

const profile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {user } = fetchUserDetails({ userId });
    res.status(200).json({
      user,
    });
  } catch(error) {
    res.status(error.statusCode || 500).json({
      error,
    });
  }
};

const addToFavorite = async(req, res) => {
    try {
      const loggedInUser = req.user;
      const { favoriteUserId } = req.body;

      await User.findByIdAndUpdate(loggedInUser._id, {
        $addToSet: { favorites: favoriteUserId }
      });

      res.status(200).json({
        success: true,
        message: 'Successfully addded into favorite list'
      });
  } catch(error) {
    res.status(error.statusCode || 500).json({
      error,
    });
  }
};  

const removeFromFavorite = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { favoriteUserId } = req.body;

    await User.findByIdAndUpdate(loggedInUser._id, {
    $pull: { favorites: favoriteUserId }
    });

    res.status(200).json({
      success: true,
      message: 'User is removed from favorite list'
    });
  } catch(error) {
    res.status(error.statusCode || 500).json({
      error,
    });
  }
};

const getAllFavorites = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const user = await User.findById(loggedInUser._id)
    .populate('favorites', 'firstName lastName email') // or USER_SAFE_DATA
    .lean(); // optional

    res.status(200).json({
      success: true,
      favorites: user,
    });
  } catch(error) {
    res.status(error.statusCode || 500).json({
      error,
    });
  }
};

module.exports = {
  requestReceived,
  connections,
  feed,
  profile,
  addToFavorite,
  removeFromFavorite,
  getAllFavorites
};