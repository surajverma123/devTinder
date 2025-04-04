const socket = require("socket.io");
const crypto = require("crypto");

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

        socket.on('sendMessage',({
            firstName,
            lastName,
            userId,
            targetUserId,
            text
        }) => {
            const roomId = getSecretRoomId(userId, targetUserId) ;
            
            io.to(roomId).emit("messageReceived", {
                firstName, text
            })
        });

        socket.on("disconnect", () => {

        })
      })
}

module.exports = initializeSocket;