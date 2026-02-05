import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["USER", "DRIVER", "ADMIN"], required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  },
  { _id: false }
);

const chatRoomSchema = new mongoose.Schema(
  {
    roomType: { type: String, enum: ["RIDE", "SUPPORT"], required: true },
    rideId: { type: mongoose.Schema.Types.ObjectId, default: null }, // required only for ride chat
    participants: { type: [participantSchema], required: true },
    lastMessage: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ChatRoom = mongoose.model("ChatRoom", chatRoomSchema);
