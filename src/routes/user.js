const express = require("express");

const router = express.Router();

const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

router.get("/requests/received", userAuth, async(req, res, next) => {
    try {
      const loggedInUser = req.user;
      const conRequest = await ConnectionRequest.findOne({
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
})


router.get("/connection", userAuth, async(req, res, next) => {
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
})

router.get("/feed", userAuth, async(req, res, next) => {
  try {
    const loggedInUser = req.user;
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
    res.json({ 
      users,
    })
  } catch(error) {
    res.status(400).json({
      message: error?.message || "Some thing went wrong"
    })
  }
});


module.exports = router;