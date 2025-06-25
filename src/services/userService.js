const ConnectionRequest = require('../models/connectionRequest');
const { USER_SAFE_DATA } = require('../utils/constant');
const User = require('../models/user');

const reqReceived = async ({ loggedInUser }) => {
  const conRequest = await ConnectionRequest.find({
    toUserId: loggedInUser._id,
    status: 'interested',
  }).populate('fromUserId', USER_SAFE_DATA);
  
  return { conRequest };
};

const userConnection = async ({ loggedInUser }) => {
  const connections = await ConnectionRequest.find({
    $or: [
      { toUserId: loggedInUser._id, status: 'accepted' },
      { fromUserId: loggedInUser._id, status: 'accepted' }
    ]
  })
  .populate('fromUserId', USER_SAFE_DATA)
  .populate('toUserId', USER_SAFE_DATA);
  console.log(connections);

  const data = connections.map(row => {
    if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
      return row.toUserId;
    }

    return row.fromUserId;
  });

  return data;
};

const userFeed = async ({ page, limit, loggedInUser }) => {
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;
 
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id },
      ]
    }).select('fromUserId toUserId');

    const hideUserFromFeed = new Set();

    connectionRequest.forEach(cReq => {
      hideUserFromFeed.add(cReq.toUserId.toString());
      hideUserFromFeed.add(cReq.fromUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed)} },
        { _id: { $ne: loggedInUser._id }}
      ]
    })
    .select(USER_SAFE_DATA)
    .skip(skip)
    .limit(limit);
    console.log('========== FEED ======', users);
    return users;
};

module.exports = { reqReceived, userConnection, userFeed };
