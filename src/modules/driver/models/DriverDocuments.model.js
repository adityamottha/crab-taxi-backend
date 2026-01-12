import mongoose from "mongoose";

const driverDocumentSchema = new mongoose.Schema({
    driverProfileId: {
      type: Schema.Types.ObjectId,
      ref: "DriverProfile",
      required: true,
      index: true,
    },

    documentType: {
      type: String,
      enum: [
        "DRIVER_LICENSE",
        "VEHICLE_RC",
        "AADHAAR_CARD",
        "PAN_CARD",
        "INSURANCE",
      ],
      required: true,
      index: true,
    },

    documentNumber: {
      type: String,
      required: true,
      trim: true,
    },

    documentImage: {
      url: {
        type: String,
        required: true, // Cloudinary 
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },

    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },

    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser", // admin
    },

    verifiedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
    },

    expiryDate: {
      type: Date, // very important for license & insurance
    },


},{timestamps:true});

export const DriverDocuments = mongoose.model("DriverDocumnets",driverDocumentSchema)