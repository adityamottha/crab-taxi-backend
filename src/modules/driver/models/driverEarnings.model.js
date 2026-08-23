import mongoose from "mongoose";

const driverEarningSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
      index: true,
    },

    date: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      default: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "INR",
    },

    totalRides: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

driverEarningSchema.index(
  {
    driverId: 1,
    date: 1,
  },
  {
    unique: true,
  }
);

export const DriverEarning = mongoose.model(
  "DriverEarning",
  driverEarningSchema
);