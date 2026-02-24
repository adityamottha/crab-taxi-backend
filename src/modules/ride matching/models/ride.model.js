import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      required: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthUser",
      default: null,
    },

    pickup: {
      lat: Number,
      lng: Number,
      address: String,
    },

    drop: {
      lat: Number,
      lng: Number,
      address: String,
    },

    distance: {
      type: Number,
      required: true,
    },

    price: Number,

    status: {
      type: String,
      enum: ["SEARCHING", "ACCEPTED", "COMPLETED", "CANCELLED"],
      default: "SEARCHING",
    },
  },
  { timestamps: true }
);

export const Ride = mongoose.model("Ride", rideSchema);