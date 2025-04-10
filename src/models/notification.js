const mongoose = require("require");

const notificationSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;