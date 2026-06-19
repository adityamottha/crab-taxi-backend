import { sendMessage } from "../modules/chatRoom/services/chat.service.js";
import { DriverProfile } from "../modules/driver/models/driverProfile.model.js"
import { onlineDrivers } from "./onlineDrivers.js";
import { Ride } from "../modules/ride matching/models/ride.model.js";
import { FareCalculator } from "./fare.calculation.js";

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
  socket.on(
    "driver-online",
    (userId) => {

      onlineDrivers.set(
        userId,
        socket.id
      );

      console.log(
        "Driver online:",
        userId
      );

      console.log(
        "Socket ID:",
        socket.id
      );
    }
  );

  // USER ONLINE
  socket.on(
    "user-online",
    (userId) => {

      socket.join(
        `user-${userId}`
      );

      console.log(
        "User online:",
        userId
      );
    }
  );

  // ACCEPT RIDE
  socket.on(
    "acceptRide",
    async ({
      rideId,
      driverId
    }) => {

      console.log(
        "ACCEPT RIDE RECEIVED"
      );

      console.log(
        "Ride ID:",
        rideId
      );

      console.log(
        "Driver ID:",
        driverId
      );

      try {

        const otp =
          FareCalculator.generateOTP();

        const ride =
          await Ride.findOneAndUpdate(
            {
              _id: rideId,
              status: "requested"
            },
            {
              driverId,
              status: "accepted",
              otp
            },
            {
              new: true
            }
          );

        console.log(
          "UPDATED RIDE:",
          ride
        );

        if (!ride) {

          return socket.emit(
            "rideError",
            {
              message:
                "Ride already accepted or not found"
            }
          );

        }

        // SEND TO DRIVER
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

        // SEND OTP TO USER
        io.to(
          `user-${ride.passengerId}`
        ).emit(
          "rideAccepted",
          {
            rideId: ride._id,
            driverId:
              ride.driverId,
            otp: ride.otp,
            pickup:
              ride.pickup,
            dropoff:
              ride.dropoff,
            fare:
              ride.fare,
            status:
              ride.status
          }
        );

        console.log(
          "Ride Accepted:",
          ride._id
        );

      } catch (error) {

        console.log(
          "ACCEPT ERROR:",
          error
        );

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

  // DRIVER LOCATION
  socket.on(
    "driverLocation",
    async (data) => {
      // keep your existing code
    }
  );

  // DISCONNECT
  socket.on(
    "disconnect",
    () => {

      for (
        const [
          userId,
          socketId
        ]
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