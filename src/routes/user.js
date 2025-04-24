const express = require("express");

const router = express.Router();

const { userAuth } = require("../middlewares/auth")
const { connections, feed, requestReceived} = require("../controllers/userController");


router.get("/requests/received", userAuth, requestReceived)


router.get("/connections", userAuth, connections)

router.get("/feed", userAuth, feed);

module.exports = router;