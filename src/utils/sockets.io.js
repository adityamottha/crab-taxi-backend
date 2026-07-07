import { sendMessage } from "../modules/chatRoom/services/chat.service.js";
import { onlineDrivers } from "./onlineDrivers.js";
import { updateDriverLocationService } from "../modules/driver/services/driverProfile.service.js";
import {
  acceptRideService,
  rejectRideService,
  startRideService,
  completeRideService,
  canceleRideService
} from "../modules/ride matching/services/ride.service.js";
import { getNearbyDriversService } from "../modules/rider/services/riderDashboard.service.js";

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
    async ({ rideId, driverId }) => {

      console.log("ACCEPT RIDE EVENT RECEIVED");
      console.log("Ride ID:", rideId);
      console.log("Driver ID:", driverId);

      try {
        const ride = await acceptRideService({
          rideId,
          driverId
        });

        // Find nearby drivers
        const nearbyDrivers =
          await getNearbyDriversService({
            lat: ride.pickup.lat,
            lng: ride.pickup.lng
          });

        // Notify all pending drivers that ride is already accepted
        for (const driver of nearbyDrivers) {

          const otherDriverId =
            driver.authUserId.toString();

          // Skip driver who accepted
          if (
            otherDriverId ===
            driverId.toString()
          ) {
            continue;
          }

          // Skip drivers who already rejected
          const alreadyRejected =
            (ride.rejectedDrivers || []).some(
              id =>
                id.toString() ===
                otherDriverId
            );

          if (alreadyRejected) {
            continue;
          }

          const socketId =
            onlineDrivers.get(
              otherDriverId
            );

          if (!socketId) {
            continue;
          }

          io.to(socketId).emit(
            "rideUnavailable",
            {
              rideId: ride._id,
              message:
                "Ride has already been accepted by another driver."
            }
          );
        }

        // Notify accepted driver
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

        // Notify passenger
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

        console.log("Ride Accepted:", ride._id);
        console.log("Nearby drivers notified.");

      } catch (error) {

        console.log(error);

        socket.emit(
          "rideError",
          {
            message: error.message
          }
        );

      }

    }
  );

  // REJECT RIDE +++++++++++++++++++++++++++++++++++++++++++++
  socket.on(
    "rejectRide",
    async ({
      rideId,
      driverId
    }) => {

      try {

        await rejectRideService({
          rideId,
          driverId
        });

        socket.emit(
          "rideRejected",
          {
            rideId
          }
        );

        console.log(
          "Ride rejected by",
          driverId
        );

      } catch (error) {

        socket.emit(
          "rideError",
          {
            message:
              error.message
          }
        );

      }

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

  // RIDE CANCELLED ===============================================
socket.on(
    "cancelledRide",
    async ({
      rideId,
      driverId,
      cancellationReason
    }) => {

      try {
        console.log(
          "COMPLETE RIDE EVENT RECEIVED"
        );
        const ride =
          await canceleRideService({
            rideId,
            driverId,
            cancellationReason
          });

        socket.emit(
          "rideCancelled",
          {
            rideId: ride._id,
            status: ride.status
          }
        );

        io.to(
          `user-${ride.passengerId}`
        ).emit(
          "rideCancelled",
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
        "rideCancelled emitted"
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
