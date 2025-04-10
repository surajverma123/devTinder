const express = require("express");
const { userAuth } = require("../middlewares/auth")
const Chat = require("../models/chat");

const router = express.Router();

router.get("/:targetUserId", userAuth, async(req, res, next) => {
    try {
        const { targetUserId } = req.params;
        const userId = req.user._id;
        const page  = req.params.page || 1;
        const limit = req.params.limit || 10;
        let chat = await Chat.findOne({
            participants: {$all: [userId, targetUserId]}
        })
        .populate({
            path: "messages.senderId",
            select: "firstName lastName emailId"
        })

        if(!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            })
        }
        await chat.save();
        res.json(chat)
    } catch(error) {
        console.log(error);
    }
});

module.exports = router;