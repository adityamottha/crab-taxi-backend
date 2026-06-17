import { Ride } from "../modules/ride/models/ride.model.js";
import { FareCalculator } from "./fare.calculation.js";

export const rideSocket = (io, socket) => {

  // DRIVER REGISTRATION
  socket.on("registerDriver", ({ driverId }) => {
    socket.join(`driver-${driverId}`);

    console.log(
      `Driver Registered: ${driverId}`
    );
  });

  // USER REGISTRATION
  socket.on("registerUser", ({ userId }) => {
    socket.join(`user-${userId}`);

    console.log(
      `User Registered: ${userId}`
    );
  });

  // DRIVER LOCATION UPDATE
  socket.on(
    "driverLocation",
    async ({ driverId, lat, lng }) => {

      console.log(
        `Driver ${driverId} location updated`
      );
    }
  );

  // ACCEPT RIDE
  socket.on(
    "acceptRide",
    async ({ rideId, driverId }) => {

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

        if (!ride) {
          return socket.emit(
            "rideError",
            {
              message:
                "Ride already accepted or not found"
            }
          );
        }

        // NOTIFY DRIVER
        io.to(
          `driver-${driverId}`
        ).emit(
          "rideAssigned",
          {
            rideId: ride._id,
            pickup: ride.pickup,
            dropoff: ride.dropoff,
            fare: ride.fare,
            status: ride.status
          }
        );

        // NOTIFY USER WITH OTP
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

  // REJECT RIDE
  socket.on(
    "rejectRide",
    async ({ rideId }) => {

      console.log(
        `Ride Rejected: ${rideId}`
      );

    }
  );
};