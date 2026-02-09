import mongoose, { Schema } from "mongoose";

// documents credential
const documentCredentialsSchema = new Schema(
  {
    documentNumber: {
      type: String,
      required: true,
      unique:true,
      trim: true,
    },

    issuedAt: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);


 // Document block schema
 
const documentBlockSchema = new Schema(
  {
    urls: {
      type: [String], // Cloudinary URLs
      required: true,
    },

    credentials: {
      type: documentCredentialsSchema,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    rejectionReason: {
      type: String,
    },
  },
  { _id: false }
);


 // Main DriverDocuments schema

const driverDocumentSchema = new Schema(
  {
    driverProfileId: {
      type: Schema.Types.ObjectId,
      ref: "DriverProfile",
      required: true,
      unique: true,
      index: true,
    },

    driverLicense: {
      type: documentBlockSchema,
      unique:true,
      required: true,
    },

    insurance: {
      type: documentBlockSchema,
      unique:true,
      required: true,
    },

    vehicleRC: {
      type: documentBlockSchema,
      unique:true,
      required: true,
    },

    documentsApprovalStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },

    documentsApprovedBy: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser", // Admin
    },

    documentsApprovedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
    },
    
  },
  { timestamps: true }
);

export const DriverDocuments = mongoose.model("DriverDocuments",driverDocumentSchema);
