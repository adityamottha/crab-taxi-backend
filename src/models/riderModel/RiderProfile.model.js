import mongoose, { Schema } from "mongoose";

const riderProfileSchema = new mongoose.Schema({
    authUserId:{
        type:Schema.Types.ObjectId,
        ref:"AuthUser",
        required:true,
        unique:true,
        index:true
    },
    name:{
        type:String,
        trim:true
    },
    gender:{
        type:String,
        enum:["MALE","FEMALE","OTHERS"],
        default:"MALE"
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
        default:true
    },
    rating:{
        type:Number,
        default:5,
        min:1,
        max:5
    }
},{timestamps:true});

export const RiderProfile = mongoose.model("RiderProfile",riderProfileSchema)