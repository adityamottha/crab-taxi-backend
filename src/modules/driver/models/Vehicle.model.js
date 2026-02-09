import mongoose from "mongoose";
import { Schema } from "mongoose";

const vehicleSchema = new mongoose.Schema({
    driverProfileId: {
      type: Schema.Types.ObjectId,
      ref: "DriverProfile",
      required: true,
      index: true,
    },

    vehicleType: {
      type: String,
      enum: ["CAR", "BIKE", "AUTO"],
      required: true,
      index: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },

    color: {
      type: String,
    },

    numberPlateNumber:{
      type:String,
      unique:true,
      trim:true
    },

    model: {
      type: String,
      trim: true,
    },

    modelManufacturingYear: {
      type: Date
    },

    modelExpiryDate:{
      type:Date
    },
    
    seatCapacity: {
      type: Number,
      default: 4,
    },

    images: [
      {
        url: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    vehicleApproved:{
     type:string,
     enum: ["PENDING", "APPROVED", "REJECTED"],
     default:"PENDING"
    },

    vehicleApprovedAt:{
      type:Date
    },

    isActive: {
      type: Boolean,
      default: false, // becomes true after verification
    },
},{timestamps:true});

export const Vehicle = mongoose.model("Vehicle",vehicleSchema);