import { sendMessage } from "../modules/chatRoom/services/chat.service.js";
import { DriverProfile } from "../modules/driver/models/driverProfile.model.js"
import { onlineDrivers } from "./onlineDrivers.js";

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
// const rideSocket = (io, socket) => {

//   socket.on("driverLocation", async (data) => {
//     try {
//       const { userId, lat, lng } = data;

//       if (!userId || !lat || !lng) return;

//       // FIRST: get driver
//       const driver = await DriverProfile.findOne({
//         authUserId: userId
//       });

//       if (!driver) return;

//       // IMPORTANT CHECK HERE
//       if (driver.driverStatus === "OFFLINE") return;

//       // ONLY update if ONLINE
//       await DriverProfile.findOneAndUpdate(
//         { authUserId: userId },
//         {
//           location: {
//             type: "Point",
//             coordinates: [lng, lat]
//           },
//           lastSeen: new Date()
//         }
//       );

//       socket.broadcast.emit("driverMoved", {
//         driverId: driver._id,
//         lat,
//         lng
//       });

//     } catch (err) {
//       console.log("Socket error:", err.message);
//     }
//   });

// };


const rideSocket = (io, socket) => {

  socket.on("driver-online", (userId) => {

    onlineDrivers.set(
      userId,
      socket.id
    );

    console.log(
      "Driver online:",
      userId
    );

  });

  socket.on("driverLocation", async (data) => {
    // your existing code
  });

  socket.on("disconnect", () => {

    for (const [userId, socketId] of onlineDrivers.entries()) {

      if (socketId === socket.id) {
        onlineDrivers.delete(userId);
        break;
      }

    }

  });

};

export { 
  chatSocket,
  rideSocket
}