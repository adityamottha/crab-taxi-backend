import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
{
    rideId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ride",
        required:true
    },

    passengerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AuthUser",
        required:true
    },

    driverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"AuthUser",
        required:true
    },

    rating:{
        type:Number,
        min:1,
        max:5,
        required:true
    },

    review:{
        type:String,
        trim:true,
        default:""
    }

},{timestamps:true});

export const Rating = mongoose.model("Rating",ratingSchema);