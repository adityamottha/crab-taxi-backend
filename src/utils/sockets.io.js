import { sendMessage } from "../modules/chatRoom/services/chat.service.js";
import { onlineDrivers } from "./onlineDrivers.js";
import { updateDriverLocationService } from "../modules/driver/services/driverProfile.service.js";
import {
  acceptRideService,
  rejectRideService,
  startRideService,
  completeRideService,
  cancelRideService
} from "../modules/ride matching/services/ride.service.js";
import { getNearbyDriversService } from "../modules/rider/services/riderDashboard.service.js";
import { AuthUser } from "../modules/auth/authUsers.models.js";

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
  "cancelRideByDriver",
  async ({ rideId, driverId, cancellationReason }) => {
    try {
      console.log("DRIVER CANCEL RIDE EVENT RECEIVED");

      // Validate driver exists and is active
      const driver = await AuthUser.findOne({
        _id: driverId,
        role: "DRIVER",
        isDeleted: false,
        accountStatus: "ACTIVE"
      });

      if (!driver) {
        socket.emit("rideError", {
          message: "Driver not found or inactive"
        });
        return;
      }

      const result = await cancelRideService({
        rideId,
        userId: driverId,
        userRole: "driver",
        cancellationReason
      });

      const { ride, cancelledBy, cancelledByUser } = result;

      // Notify driver
      socket.emit("rideCancelled", {
        rideId: ride._id,
        status: ride.status,
        cancellationReason: ride.cancellationReason,
        cancelledAt: ride.cancelledAt,
        cancelledBy: "driver",
        message: "Ride cancelled successfully"
      });

      // Notify passenger
      const passengerId = ride.passengerId._id || ride.passengerId;
      io.to(`user-${passengerId}`).emit("rideCancelled", {
        rideId: ride._id,
        status: ride.status,
        cancellationReason: ride.cancellationReason,
        cancelledAt: ride.cancelledAt,
        cancelledBy: "driver",
        message: "Your ride has been cancelled by the driver",
        driverInfo: {
          phoneNumber: cancelledByUser.phoneNumber
        }
      });

      console.log(`Ride ${ride._id} cancelled by driver: ${driver.phoneNumber}`);

    } catch (error) {
      console.error("Driver cancel error:", error.message);
      socket.emit("rideError", { 
        message: error.message,
        code: error.statusCode || 500
      });
    }
  }
);

// Passenger cancels ride
socket.on(
  "cancelRideByPassenger",
  async ({ rideId, passengerId, cancellationReason }) => {
    try {
      console.log("PASSENGER CANCEL RIDE EVENT RECEIVED");

      // Validate passenger exists and is active
      const passenger = await AuthUser.findOne({
        _id: passengerId,
        role: "USER",
        isDeleted: false,
        accountStatus: "ACTIVE"
      });

      if (!passenger) {
        socket.emit("rideError", {
          message: "Passenger not found or inactive"
        });
        return;
      }

      const result = await cancelRideService({
        rideId,
        userId: passengerId,
        userRole: "passenger",
        cancellationReason
      });

      const { ride, cancelledBy, cancelledByUser } = result;

      // Notify passenger
      socket.emit("rideCancelled", {
        rideId: ride._id,
        status: ride.status,
        cancellationReason: ride.cancellationReason,
        cancelledAt: ride.cancelledAt,
        cancelledBy: "passenger",
        message: "Ride cancelled successfully"
      });

      // Notify driver if exists
      if (ride.driverId) {
        const driverId = ride.driverId._id || ride.driverId;
        io.to(`driver-${driverId}`).emit("rideCancelled", {
          rideId: ride._id,
          status: ride.status,
          cancellationReason: ride.cancellationReason,
          cancelledAt: ride.cancelledAt,
          cancelledBy: "passenger",
          message: "Ride has been cancelled by the passenger",
          passengerInfo: {
            phoneNumber: cancelledByUser.phoneNumber
          }
        });
      }

      console.log(`Ride ${ride._id} cancelled by passenger: ${passenger.phoneNumber}`);

    } catch (error) {
      console.error("Passenger cancel error:", error.message);
      socket.emit("rideError", { 
        message: error.message,
        code: error.statusCode || 500
      });
    }
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
