import mongoose, { Schema } from "mongoose";

const driverProfileSchema = new mongoose.Schema({
    authUserId:{
        type:Schema.Types.ObjectId,
        ref: "AuthUser",
        required:true,
        unique:true,
        index:true
    },

    name:{
        type:String,
        required:true,
        trim:true,

    },
    avatar:{
        type:String,
        uploadedAt:Date,
        required:true
    },

    dateOfBirth:{
        type:Date
    },
   
    //DRIVER STATUS AT RUNTIME
    driverStatus:{
        type:String,
        enum:["OFFLINE","ONLINE","ON_RIDE","INACTIVE"],
        default:"OFFLINE",
        index:true
    },

    approvedBy:{
        type:Schema.Types.ObjectId,
        ref:"AuthUser" // ADMIN
    },

    approvedAt:{
        type:Date
    },
    rejectionReason:{
        type: String
    },

    // VEHICLE $ PERFORMANCE 
    vehicleId:{
        type:Schema.Types.ObjectId,
        ref: "Vehicle",
    },
    totalTrips:{
        type:Number,
        default:0
    },
    rating:{
        type:Number,
        default:5,
        min:1,
        max:5
    },
    ratingAccount:{
        type:Number,
        default:0
    },

    // SUSPENSION
    isSuspended: {
        type:Boolean,
        default:false
    },
    suspensionReason:{
        type:String
    }
},{timestamps:true});

export const DriverProfile = mongoose.model("DriverProfile",driverProfileSchema);