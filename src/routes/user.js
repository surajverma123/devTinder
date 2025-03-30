const express = require("express");

const router = express.Router();

const { userAuth } = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest");
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

module.exports = router;