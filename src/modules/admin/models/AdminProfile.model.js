import mongoose, { Schema } from "mongoose";

const adminProfileSchema = new mongoose.Schema({
    authUserId:{
        type: Schema.Types.ObjectId,
        ref:"AuthUser",
        required:true
    },
    name:{
        type:String,
        trim:true,
        required:true
    },
    avatar:{
        type:String, //cloudniary
        uploadedAt:true
    },
    designation:{
        type:String,
        default: "ADMIN"
    },
    permissions:{
        type: [String], //eg driver approval and rejection blocked and view docs
        default: [],
    },
    lastActionAt:{
        type:Date
    }

},{timestamps:true});

export const AdminProfile = mongoose.model("AdminProfile",adminProfileSchema);