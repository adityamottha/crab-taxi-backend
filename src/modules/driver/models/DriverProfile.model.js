import mongoose, { Schema } from "mongoose";

const driverAddress = new mongoose.Schema({
    houseNumber:{
        type:String,
        trim:true,
        required:true
    },

    area:{
        type:String,
        trim:true,
        required:true
    },

    landmark:{
        type:String,
        trim:true,
        required:true
    },

    city:{
        type:String,
        trim:true
    },

    state:{
        type:String,
        trim:true,
        required:true
    },

    country:{
        type:String,
        trim:true,
        required:true
    },

    pincode:{
        type:String,
        trim:true,
        required:true
    },

    isVerified:{
        type:Boolean,
        default:false,
    }
})

const driverProfileSchema = new mongoose.Schema({
    authUserId:{
        type:Schema.Types.ObjectId,
        ref: "AuthUser",
        required:true,
        unique:true,
        index:true
    },

    fullname:{
        type:String,
        required:true,
        trim:true,

    },
    avatar:{
        type:String,
        required:true
    },

    avatarUploadedAt:{
        type:Date
    },

    dateOfBirth:{
        type:Date
    },

    address:[driverAddress],
   
    //DRIVER STATUS AT RUNTIME
    driverStatus:{
        type:String,
        enum:["OFFLINE","ONLINE","ON_RIDE","INACTIVE"],
        default:"OFFLINE",
        index:true
    },

    vehicleApprovedBy:{
        type:Schema.Types.ObjectId,
        ref:"AuthUser" // ADMIN
    },

    vehicleApprovedAt:{
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