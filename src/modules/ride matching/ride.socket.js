import { Ride } from "./models/ride.model.js";
import { matchDriversService } from "./services/rideMatching.service.js";
// import { redis } from "../../db/redis.js";

export const rideSocket = (io, socket) => {

  socket.on("registerDriver", ({ driverId }) => {
    socket.join(driverId);
  });

  socket.on("driverLocation", async ({ driverId, lat, lng }) => {
    await AuthUser.findByIdAndUpdate(driverId, {
      location: { lat, lng },
      isOnline: true,
    });
  });

  socket.on("acceptRide", async ({ rideId, driverId }) => {
    const ride = await Ride.findOneAndUpdate(
      { _id: rideId, status: "SEARCHING" },
      { status: "ACCEPTED", driverId },
      { new: true }
    );

    if (!ride) return;

    io.to(ride.userId.toString()).emit("rideAccepted", ride);
  });

  socket.on("rejectRide", async ({ rideId }) => {
    await matchDriversService(rideId);
  });
};
