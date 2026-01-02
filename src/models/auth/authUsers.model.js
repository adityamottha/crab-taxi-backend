import mongoose from "mongoose";

const authSchema = new mongoose.Schema({

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
        type:date
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
      default: 0,
    },

    tokenInvalidBefore: {
      type: Date,
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

export const AuthUser = mongoose.model("AuthUser",authSchema)