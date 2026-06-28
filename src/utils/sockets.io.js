import { sendMessage } from "../modules/chatRoom/services/chat.service.js";
import { DriverProfile } from "../modules/driver/models/driverProfile.model.js"
import { onlineDrivers } from "./onlineDrivers.js";
import { updateDriverLocationService } from "../modules/driver/services/driverProfile.service.js";
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


// =================RIDE SOCKET ===========================================
const rideSocket = (io, socket) => {

  // DRIVER ONLINE +++++++++++++++++++++++++++++++++++++
  socket.on("driver-online", (userId) => {

    onlineDrivers.set(
      userId,
      socket.id
    );

    console.log("\n========== DRIVER ONLINE ==========");
    console.log("Driver ID:", userId);
    console.log("Socket ID:", socket.id);
    console.log(
      "Current Online Drivers:",
      [...onlineDrivers.entries()]
    );
    console.log("===================================\n");

  });

  // USER ONLINE +++++++++++++++++++++++++++++++++++++++++++++++++++++
  socket.on("user-online", (userId) => {

    socket.join(
      `user-${userId}`
    );

    console.log("\n========== USER ONLINE ==========");
    console.log("User ID:", userId);
    console.log("Socket ID:", socket.id);
    console.log("=================================\n");

  });

  // ACCEPT RIDE +++++++++++++++++++++++++++++++++++++++++++++
  socket.on(
    "acceptRide",
    async ({
      rideId,
      driverId
    }) => {

      try {

        console.log(
          "ACCEPT RIDE EVENT RECEIVED"
        );

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

      console.log(
        "rideAssigned emitted to driver"
      );

      console.log(
        "rideAccepted emitted to user"
      );

    }
  );

  // START RIDE +++++++++++++++++++++++++++++++++++++++++++
  socket.on(
    "startRide",
    async ({
      rideId,
      otp
    }) => {

      try {
        console.log(
          "START RIDE EVENT RECEIVED"
        );
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
      console.log(
        "rideStarted emitted"
      );
    }
  );

  // COMPLETE RIDE +++++++++++++++++++++++++++++++++++++++++++++++++++
  socket.on(
    "completeRide",
    async ({
      rideId,
      driverId
    }) => {

      try {
        console.log(
          "COMPLETE RIDE EVENT RECEIVED"
        );
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
      console.log(
        "rideCompleted emitted"
      );
    }
  );

  // DRIVER LOCATION +++++++++++++++++++++++++++++++++++++++++++++++++++++
  socket.on("driverLocation", async (data) => {
   console.log("driverLocation received");
    console.log(data); 

    try {

      const { userId, lat, lng } = data;

      const driver = await updateDriverLocationService(
        userId,
        lat,
        lng
      ); 

      console.log({
      driverId: driver.authUserId,
      lat,
      lng,
      updatedAt: driver.lastSeen
    });

      io.emit("driverMoved", {
        driverId: driver.authUserId,
        lat,
        lng
      });

    } catch (err) {

      console.log("Driver Location Error:", err.message);

      socket.emit("error", {
        message: err.message
      });

    }

  });

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
