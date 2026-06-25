import { Ride } from "../modules/ride/models/ride.model.js";
import { FareCalculator } from "./fare.calculation.js";
import { onlineDrivers } from "./onlineDrivers.js";

export const rideSocket = (io, socket) => {

  // DRIVER REGISTER
  socket.on(
    "registerDriver",
    ({ driverId }) => {

      console.log(
        "REGISTER DRIVER EVENT RECEIVED"
      );

      console.log(
        "Driver ID:",
        driverId
      );

      console.log(
        "Socket ID:",
        socket.id
      );

      onlineDrivers.set(
        driverId,
        socket.id
      );

      console.log(
        "Map Size:",
        onlineDrivers.size
      );
    }
  );

  // USER REGISTER
  socket.on("registerUser", ({ userId }) => {

    socket.join(
      `user-${userId}`
    );

    console.log(
      "User Registered:",
      userId
    );
  });

  // DRIVER ACCEPTS RIDE
  socket.on(
    "acceptRide",
    async ({ rideId, driverId }) => {

      console.log("ACCEPT RIDE EVENT RECEIVED");
      console.log("Ride ID:", rideId);
      console.log("Driver ID:", driverId);

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

          console.log("UPDATED RIDE:", ride);

        if (!ride) {
          return socket.emit(
            "rideError",
            {
              message:
                "Ride already accepted or not found"
            }
          );
        }

        // DRIVER NOTIFICATION
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

        // USER NOTIFICATION
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

        console.log(
          "Ride Accepted:",
          ride._id
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

  // DRIVER DISCONNECT
  socket.on(
    "disconnect",
    () => {

      for (
        const [driverId, socketId]
        of onlineDrivers.entries()
      ) {

        if (
          socketId === socket.id
        ) {

          onlineDrivers.delete(
            driverId
          );

          console.log(
            "Driver Offline:",
            driverId
          );

          break;
        }
      }
    }
  );
};