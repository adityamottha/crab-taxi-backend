import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AuthUser',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AuthUser',
    default:null
  },
  pickup: {
    lat: Number,
    lng: Number,
    address: String
  },
  dropoff: {
    lat: Number,
    lng: Number,
    address: String
  },
  fare: {
    amount: {
      type:Number,
      required:true
    },
    
    currency: { 
      type: String,
       default: 'INR',
       required:true
     },

    distance:{
      type:Number,
      required:true
    },

    duration:{
      type:Number,
      required:true
    },
  },

  // TYPE OF VEHICLE 
    vehicleCategory:{
      type:String,
      enum:["SEDAN","TWO_WHEELER","SUV","PREMIUM_SUV"],
      required:true
    },
    
  status: {
    type: String,
    enum: ['requested', 'accepted', 'started', 'completed', 'cancelled'],
    default: 'requested'
  },
  otp: {
    type: String,
    default: null
  },

  rejectedDrivers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuthUser"
  }
],

 startedAt: {
  type:Date
},

  completedAt: {
    type:Date
  },

  cancelledAt: {
    type:Date
  },

  cancellationReason: {
    type:String
  },

  // DRIVER ASSIGNMENT --------

  assignmentType:{
    type:String,
    enum:["AUTO","MANUAL"],
    default:null
  },

  assignedAt:{
    type:Date,
    default:null
  },

  assignedBy:{
    type:mongoose.Types.ObjectId,
    ref:"AuthUser"
  },
  
}, { timestamps: true });

export const Ride = mongoose.model('Ride', rideSchema);