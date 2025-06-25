const ConnectionRequest = require('../models/connectionRequest');
const { reqReceived, userConnection, userFeed } = require("../services/userService");

const User = require('../models/user');

const USER_SAFE_DATA = 'fullName firstName lastName photoUrl age gender about skills status lastSeen';

const requestReceived = async(req, res) => {
    try {
      const loggedInUser = req.user;
      await reqReceived({ loggedInUser });

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

module.exports = {
  requestReceived,
  connections,
  feed,
};