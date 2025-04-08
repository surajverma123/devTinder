const socket = require("socket.io");
const crypto = require("crypto");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const Chat = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // Handle events
    socket.on("joinChat", async ({ userId, targetUserId, firstName }) => {
      const room = getSecretRoomId(userId, targetUserId);
      const user = await User.findOneAndUpdate(
        { _id: userId },                         // filter
        { status: "online", lastSeen: null },   // update
        { new: true }                           // options: return updated document
      );
      // console.log("=========== USER ==========", user);
      socket.join(room);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        // Save message to the database
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          // check the userId & targetUserId should be friends
          const isFriend = ConnectionRequest.findOne({
            $or: [
              {
                status: "accepted",
                fromUserId: userId,
                toUserId: targetUserId,
              },
              {
                status: "accepted",
                fromUserId: targetUserId,
                toUserId: userId,
              },
            ],
          });

          if (!isFriend) {
            return null;
          }

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text,
          });
          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            text,
            lastName,
          });
        } catch (error) {
          console.error(error);
        }
      }
    );

    socket.on("user-disconnecting", async ({ userId }) => {
      console.log("=========== USER ID =======", userId);
      await User.findOneAndUpdate(
        { _id: userId },                         // filter
        { status: "offline", lastSeen: new Date() },   // update
        { new: true }                           // options: return updated document
      );
    });

    socket.on("disconnect", async (userId ) => {
      console.log("User dis-connected successfully");
    });
  });
};

module.exports = initializeSocket;
