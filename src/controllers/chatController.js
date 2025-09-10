const { chatWithFriend } = require('../services/chatService');

const chatWithUser = async(req, res) => {
  try {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    const page  = req.params.page || 1;
    const limit = req.params.limit || 10;
    // const skip = (page -1) * limit;
    // limit = limit > 50 ? 50: limit;

    const { chat } = await chatWithFriend({ targetUserId, userId });
    res.json(chat);
  } catch(error) {
      console.log(error);
  }
};

module.exports = {
  chatWithUser
};