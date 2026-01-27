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

    fullnameUpdatedAt:{
        type:Date,
        default:null
    },

    gender:{
        type:String,
        enum:["MALE","FEMALE","OTHERS"],
        required:true
    },

    genderUpdatedAt:{
        type:Date,
        default:null
    },
    userAvatar:{
        type:String // cloudniary
    },

    avatarUpdatedAt:{
        type:Date,
        default:null
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