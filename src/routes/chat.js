const express = require("express");

const { userAuth } = require("../middlewares/auth")
const { chatWithUser } = require("../controllers/chatController");

const router = express.Router();

router.get("/:targetUserId", userAuth, chatWithUser);

module.exports = router;