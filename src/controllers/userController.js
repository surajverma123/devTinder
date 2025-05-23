const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "fullName firstName lastName photoUrl age gender about skills status lastSeen";

const requestReceived = async(req, res, next) => {
    try {
      const loggedInUser = req.user;
      const conRequest = await ConnectionRequest.find({
        toUserId: loggedInUser._id,
        status: "interested"
      })
      .populate('fromUserId', USER_SAFE_DATA)

      res.status(200).json({
        message: 'Data fetched successfully',
        data: conRequest,
      })
    } catch(error) {
        res.status(400).send("Error "+ error.message)
    }
}

const connections = async(req, res, next) => {
  try {
    const loggedInUser = req.user;
    // Suraj ==> sent ==> Akash
    // Pooja ==> sent ==> Suraj
    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" }
      ]
    })
    .populate("fromUserId", USER_SAFE_DATA)
    .populate("toUserId", USER_SAFE_DATA);
    console.log(connections);

    const data = connections.map(row => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId
      }

      return row.fromUserId;
    })
    res.json({ data });
  } catch(error) {
    res.status(400).json({
      message: `Error: ${error.message}`
    })
  }
}

const feed = async(req, res, next) => {
  try {
    const loggedInUser = req.user;
    const page = req.params.page || 1;
    let limit = req.params.limit || 10;
    const skip = (page - 1) * limit;
    limit = limit > 50 ? 50 : limit;
 
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id },
      ]
    }).select("fromUserId toUserId");

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
    .limit(limit)
    console.log("========== FEED ======", users);
    res.json({ 
      users,
    })
  } catch(error) {
    res.status(400).json({
      message: error?.message || "Some thing went wrong"
    })
  }
}

module.exports = {
  requestReceived,
  connections,
  feed,
}