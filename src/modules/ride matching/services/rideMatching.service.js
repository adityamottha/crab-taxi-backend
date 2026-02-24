// import { redis } from "../../../db/redis.js";

export const matchDriversService = async (ride) => {
  const drivers = await redis.georadius(
    "drivers:locations",
    ride.pickup.lng,
    ride.pickup.lat,
    5,
    "km",
    "WITHDIST",
    "ASC"
  );

  if (!drivers.length) {
    console.log("No drivers nearby");
    return;
  }

  const queueKey = `ride:${ride._id}:drivers`;

  for (let driver of drivers) {
    await redis.rpush(queueKey, driver[0]);
  }

  await assignNextDriver(ride._id);
};

export const assignNextDriver = async (rideId) => {
  const queueKey = `ride:${rideId}:drivers`;

  const driverId = await redis.lpop(queueKey);

  if (!driverId) {
    console.log("No more drivers");
    return;
  }

  global.io.to(driverId).emit("rideRequest", { rideId });
};
