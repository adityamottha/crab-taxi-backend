import mongoose from "mongoose";
import { AuthUser } from "../../auth/authUsers.models.js";

const rideSchema = new mongoose.Schema({
  passengerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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
    currency: { type: String, default: 'USD' },
    distance: Number,
    duration: Number
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

module.exports = mongoose.model('Ride', rideSchema);