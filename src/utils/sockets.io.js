import { sendMessage } from "../modules/chatRoom/services/chat.service.js";
import { DriverProfile } from "../modules/driver/models/driverProfile.model.js"
import { onlineDrivers } from "./onlineDrivers.js";
import {
  acceptRideService,
  startRideService,
  completeRideService
} from "../modules/ride matching/services/ride.service.js";

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

const rideSocket = (io, socket) => {

  // DRIVER ONLINE
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

  // USER ONLINE
  socket.on("user-online", (userId) => {

    socket.join(
      `user-${userId}`
    );

    console.log(
      "User online:",
      userId
    );

  });

  // ACCEPT RIDE
  socket.on(
    "acceptRide",
    async ({
      rideId,
      driverId
    }) => {

      try {

        const ride =
          await acceptRideService({
            rideId,
            driverId
          });

        socket.emit(
          "rideAssigned",
          {
            rideId: ride._id,
            pickup: ride.pickup,
            dropoff: ride.dropoff,
            fare: ride.fare,
            status: ride.status
          }
        );

        io.to(
          `user-${ride.passengerId}`
        ).emit(
          "rideAccepted",
          {
            rideId: ride._id,
            driverId: ride.driverId,
            otp: ride.otp,
            pickup: ride.pickup,
            dropoff: ride.dropoff,
            fare: ride.fare,
            status: ride.status
          }
        );

      } catch (error) {

        socket.emit(
          "rideError",
          {
            message: error.message
          }
        );

      }

    }
  );

  // START RIDE
  socket.on(
    "startRide",
    async ({
      rideId,
      otp
    }) => {

      try {

        const ride =
          await startRideService({
            rideId,
            otp
          });

        socket.emit(
          "rideStarted",
          {
            rideId: ride._id,
            status: ride.status
          }
        );

        io.to(
          `user-${ride.passengerId}`
        ).emit(
          "rideStarted",
          {
            rideId: ride._id,
            status: ride.status
          }
        );

      } catch (error) {

        socket.emit(
          "rideError",
          {
            message: error.message
          }
        );

      }

    }
  );

  // COMPLETE RIDE
  socket.on(
    "completeRide",
    async ({
      rideId,
      driverId
    }) => {

      try {

        const ride =
          await completeRideService({
            rideId,
            driverId
          });

        socket.emit(
          "rideCompleted",
          {
            rideId: ride._id,
            status: ride.status
          }
        );

        io.to(
          `user-${ride.passengerId}`
        ).emit(
          "rideCompleted",
          {
            rideId: ride._id,
            status: ride.status
          }
        );

      } catch (error) {

        socket.emit(
          "rideError",
          {
            message: error.message
          }
        );

      }

    }
  );

  // DRIVER LOCATION
  socket.on(
    "driverLocation",
    async (data) => {
      // keep your existing location code
    }
  );

  // DISCONNECT
  socket.on(
    "disconnect",
    () => {

      for (
        const [userId, socketId]
        of onlineDrivers.entries()
      ) {

        if (
          socketId === socket.id
        ) {

          onlineDrivers.delete(
            userId
          );

          console.log(
            "Driver Offline:",
            userId
          );

          break;
        }

      }

    }
  );

};

export {
  chatSocket,
  rideSocket
}