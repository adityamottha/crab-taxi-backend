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
    amount: Number,
    currency: { type: String, default: 'INR' },
    distance: Number,
    duration: Number,
    required:true
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'started', 'completed', 'cancelled'],
    default: 'requested'
  },
  otp: {
    type: String,
    required: true
  },
  startedAt: Date,
  completedAt: Date,
  cancellationReason: String
}, { timestamps: true });

export const Ride = mongoose.model('Ride', rideSchema);