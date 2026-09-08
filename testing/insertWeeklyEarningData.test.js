
import mongoose from "mongoose";
import dotenv from "dotenv";
import { DriverEarning } from "../src/modules/driver/models/driverEarnings.model.js";
dotenv.config({
    path:"../.env"
});
// console.log("MONGODB_URI", process.env.MONGODB_URI)

const driverId = new mongoose.Types.ObjectId(
  "6a9d5f3b621d7c4e96e1fef0"
);

const inserForTestDriverEarnings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await DriverEarning.insertMany([
      {
        driverId,
        date: new Date("2026-09-07"),
        amount: 500,
        totalRides: 5,
        currency: "CAD",
      },
      {
        driverId,
        date: new Date("2026-09-06"),
        amount: 300,
        totalRides: 3,
        currency: "CAD",
      },
      {
        driverId,
        date: new Date("2026-09-03"),
        amount: 700,
        totalRides: 7,
        currency: "CAD",
      },
      {
        driverId,
        date: new Date("2026-08-31"),
        amount: 400,
        totalRides: 4,
        currency: "CAD",
      },
      {
        driverId,
        date: new Date("2026-08-25"),
        amount: 900,
        totalRides: 9,
        currency: "CAD",
      },
      {
        driverId,
        date: new Date("2026-08-20"),
        amount: 600,
        totalRides: 6,
        currency: "CAD",
      },
    ]);

    console.log("Driver earning test data inserted");

    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

inserForTestDriverEarnings();