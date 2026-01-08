import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { Schema } = mongoose;

const authUserSchema = new mongoose.Schema({

    // CORE IDENTITY

    phoneNumber:{
        type:String,
        index:true,
        unique:true,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
        partialFilterExpression: { email: { $exists: true } },
        lowercase:true,
        trim:true
    },

    password:{
      required:true,
        type:String,
        trim:true,
        select:false
    },

    countryCode:{
        type:String,
        default:"+91"
    },

    authProvider:{
        type:String,
        enum:["OTP","EMAIL","GOOGLE","APPLE",],
        default:"OTP"
    },

    // role based access control and Permissions

    role:{
        type:String,
        enum:["USER","DRIVER","ADMIN"],
        required:true,
        index:true,
    },

    permission:{
        type:[String],
        default:[]
    },

    // Verfications 

    isOtpVerified:{
        type:String,
        default:false
    },

    phoneNumberVerifiedAt:{
        type:Date
    },

    // ACCOUNT LIFECYCLE 

    accountStatus:{
        type:String,
        enum:["PENDING","ACTIVE","SUSPENDED","BLOCKED","DELETED"],
        default:"PENDING",
        index:true
    },

    blockedReason:{
        type:String // example froud documentations submitted by Driver
    },

    blockedAt:{
        type:Date
    },

    // DRIVER APPROVAL STATUS 

    driverApprovalStatus:{
        type:String,
        enum:["NOT_APPLICABLE","APPROVED","PENDING","REJECT"],
        default:"NOT_APPLICABLE"
    },

        kycRequired: {
      type: Boolean,
      default: false,
    },

    kycCompleted: {
      type: Boolean,
      default: false,
    },

    // PROFILE REFERENCE 

     userProfileId: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
    },

    driverProfileId: {
      type: Schema.Types.ObjectId,
      ref: "DriverProfile",
    },

    adminProfileId:{
        type: Schema.Types.ObjectId,
        ref: "AdminProfile"
    },

    //    SECURITY & SESSION CONTROL

    lastLoginAt: {
      type: Date,
    },

    lastLogoutAt: {
      type: Date,
    },

    loginCount: {
      type: Number,
      default: 0,
    },

  refreshTokenVersion: {
  type: Number,
  default: 0
},

    //    OTP ABUSE PREVENTION
   
    otpAttempts: {
      type: Number,
      default: 0,
    },

    otpBlockedUntil: {
      type: Date,
    },

    lastOtpRequestedAt: {
      type: Date,
    },

    //    DEVICE & AUDIT

    lastLoginIp: {
      type: String,
    },

    lastLoginDevice: {
      type: String,
    },

    createdFrom: {
      type: String,
      enum: ["ANDROID", "IOS", "WEB"],
      default: "ANDROID",
    },

    createdBy: {
      type: String,
      enum: ["SELF", "ADMIN"],
      default: "SELF",
    },


    //    SOFT DELETE
   
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
    },

    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: "AuthUser",
    },

},{timestamps:true});

// PASSWORD HASH (ENCRYPTION)
authUserSchema.pre("save", async function(){
  try {

    if(!this.isModified("password")) return;
  
    this.password = await bcrypt.hash(this.password, 10);

  } catch (error) {
    console.log("BCRYPT ERROR:- ",error?.message || "Failed to hash password!");
    next(error);
  }
});

// COMPARE PASSWORD (DE-ENCRYPTION)
authUserSchema.methods.isPasswordCorrect = async function (password){
  try {
    return await bcrypt.compare(password,this.password);
  } catch (error) {
    console.log("BCRYPT ERROR:- ",error?.message || "Failed to compare password!");
    
  }
};

// GENERATE ACCESS TOKEN
authUserSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      userId:this._id,
      role: this.role
    },

    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
  );
};

// GENERATE REFRESH TOKEN 
authUserSchema.methods.generateRefreshToken = function (){
  return jwt.sign(
    {
      userId:this._id,
      tokenVersion: this.refreshTokenVersion
    },

    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}
export const AuthUser = mongoose.model("AuthUser",authUserSchema)