import { Ride } from "./models/ride.model.js";
import { assignNextDriver } from "./services/rideMatching.service.js";
// import { redis } from "../../db/redis.js";

export const rideSocket = (io, socket) => {

  socket.on("registerDriver", ({ driverId }) => {
    socket.join(driverId);
  });

  socket.on("driverLocation", async ({ driverId, lat, lng }) => {
    await redis.geoadd("drivers:locations", lng, lat, driverId);
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
    await assignNextDriver(rideId);
  });
};
