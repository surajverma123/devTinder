const Chat = require('../models/chat');

const chatWithFriend = async ({ userId, targetUserId }) => {
  let chat = await Chat.findOne({
    participants: { $all: [userId, targetUserId] },
  }).populate({
    path: 'messages.senderId',
    select: 'firstName lastName emailId',
  });

  if (!chat) {
    chat = new Chat({
      participants: [userId, targetUserId],
      messages: [],
    });
  }
  await chat.save();

  return { chat };
};

module.exports = {
  chatWithFriend,
};
