const express = require("express");
const { userAuth } = require("../middlewares/auth");
const router = express.Router();

router.post("/send/:status/:toUserId", userAuth, );

router.post("/review/:status/:requestId", userAuth, )

module.exports = router;