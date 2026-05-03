import { sendMessage } from "../modules/chatRoom/services/chat.service.js";
import { DriverProfile } from "../modules/driver/models/driverProfile.model.js"

// CHAT SOCKET ---------------------------------------------
const chatSocket = (io, socket) => {
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", async ({ roomId, senderRole, senderId, text }) => {
    try {
      const msg = await sendMessage({ roomId, senderRole, senderId, text });
      io.to(roomId).emit("newMessage", msg);
    } catch (err) {
      socket.emit("chatError", { message: err.message });
    }
  });
};



// RIDE SOCKET-----------------------------------------------------

const rideSocket = (io, socket) => {

  socket.on("driverLocation", async (data) => {
    try {
      const { userId, lat, lng } = data;

      if (!userId || !lat || !lng) return;

      await DriverProfile.findOneAndUpdate(
        { authUserId: userId },
        {
          location: {
            type: "Point",
            coordinates: [lng, lat]
          },
          lastSeen: new Date(),
          driverStatus: "ONLINE"
        }
      );

      socket.broadcast.emit("driverMoved", {
        userId,
        lat,
        lng
      });

    } catch (err) {
      console.log("Socket error:", err.message);
    }
  });

};

export { 
  chatSocket,
  rideSocket
}