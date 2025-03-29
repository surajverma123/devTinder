const express = require("express");
const { userAuth } = require("../middlewares/auth");
const  = require("../models/user")
const ConnectionRequest = require("../models/connectionRequest");

const router = express.Router();

router.post("/send/:status/:toUserId", userAuth, async (req, res, next) => {
  try{
    const fromUserId =  req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const allowedStatus = ['ignored', 'interested'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status type" + status})
    }

    const isToUserExits = await User.findById(toUserId);
    if (!isToUserExits) {
      return res.status(404).send("User not found");
    }
    // IF there is an existing connection request
    const exitstingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ]
    });

    if (exitstingConnectionRequest) {
      return res.status(400).json({
        message: "Connection request is exits"
      })
    }

    const connectReuest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status
    })
    await connectReuest.save();
    res.status(200).json({
      message: req.user.firstName + " is " + status + " in " + isToUserExits.firstName,
      connectReuest
    })
  } catch(error) {
    res.status(400).send("Error: " + error.message)
  }
});

router.post("/review/:status/:requestId", userAuth, async(req, res, next) => {
  try {
    const loggedInUser = req.user;
    const status = req.params.status;
    const requestId = req.params.requestId;
    

    // validate the request
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      throw new Error("Status is not allowed ")
    }
    // request Id should be valid
     
    // loggedInId === toUserId
    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested",
    })

    if (!connectionRequest) {
      throw new Error("Connection request not found")
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();
    
    res.status(200).json({
      message: `Connection request ${status}`,
      data,
    })

  } catch(error) {
    res.status(400).send("Error: " + error.message)
  }
})

module.exports = router;