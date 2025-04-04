const socket = require("socket.io");
const crypto = require("crypto");
const Chat  = require("../models/chat");

const getSecretRoomId = (userId, targetUserId) => {
   return crypto.createHash('sha256')
    .update([userId,targetUserId].sort().join("_"))
    .digest("hex");
}
const initializeSocket = (server) => {
    const io = socket(server, {
        cors: {
          origin: "http://localhost:5173",
        },
      });
      
      io.on('connection', (socket) => {
        // Handle events
        socket.on("joinChat", ({ userId, targetUserId, firstName }) => {
            const room = getSecretRoomId(userId, targetUserId);

            socket.join(room)
        });

        socket.on('sendMessage', async ({
            firstName,
            lastName,
            userId,
            targetUserId,
            text
        }) => {
            const roomId = getSecretRoomId(userId, targetUserId) ;
            console.log("======== TEXT =======", text);
            console.log("======== TEXT userId =======", userId);
            console.log("======== TEXT targetUserId =======", targetUserId);
            // Save message to the database
            try {
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId]}
                })
               
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages:[]
                    })
                }
                chat.messages.push({
                    senderId: userId,
                    text,
                });
                await chat.save();
                io.to(roomId).emit("messageReceived", {
                    firstName, text
                })
            } catch(error) {
                console.error(error);
            }

        });

        socket.on("disconnect", () => {

        })
      })
}

module.exports = initializeSocket;