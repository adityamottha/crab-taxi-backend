import mongoose, { Schema } from "mongoose";

const riderProfileSchema = new mongoose.Schema({
    authUserId:{
        type:Schema.Types.ObjectId,
        ref:"AuthUser",
        required:true,
        unique:true,
        index:true
    },
    fullname:{
        type:String,
        trim:true,
        required:true
    },
    gender:{
        type:String,
        enum:["MALE","FEMALE","OTHERS"],
        required:true
    },
    userAvatar:{
        type:String // cloudniary
    },
    walletBalance:{
        type:Number,
        default:0
    },
    totalRides:{
        type:Number,
        default:0
    },
    rating:{
        type:Number,
        default:5,
        min:0,
        max:5
    }
},{timestamps:true});

export const RiderProfile = mongoose.model("RiderProfile",riderProfileSchema)