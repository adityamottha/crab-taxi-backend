import { ChatRoom } from "../models/chatRoom.model.js";
import { Message } from "../models/message.model.js";
import { ApiError } from "../../../utils/ApiError.js";
import { AuthUser} from "../../auth/authUsers.models.js";

const ROLES = {
  USER: "USER",
  DRIVER: "DRIVER",
  ADMIN: "ADMIN",
};

// ensures that participants are sorted
const sortParticipants = (participants = []) => {
  if (!Array.isArray(participants)) 
    throw new ApiError(400, "participants must be an array");

  participants.forEach((p, i) => {
    if (!p?.role) 
      throw new ApiError(400, `participants[${i}].role is required`);
    if (!p?.userId) 
      throw new ApiError(400, `participants[${i}].userId is required`);
  });

  return [...participants].sort((a, b) => {
    if (a.role !== b.role) return a.role.localeCompare(b.role);
    return String(a.userId).localeCompare(String(b.userId));
  });
};

// ensures that room is valid
const validateRoom = ({ roomType, rideId, participants }) => {
  const has = (role) => participants.some((p) => p.role === role);

  if (roomType === "RIDE") {
    if (!rideId) 
      throw new ApiError(400,"rideId is required for ride chat");
    if (!(has(ROLES.USER) && has(ROLES.DRIVER))) {
      throw new ApiError(400,"Ride chat must be USER ↔ DRIVER only");
    }
    if (has(ROLES.ADMIN)) 
      throw new ApiError(400,"Admin cannot join ride chat");
  }

  if (roomType === "SUPPORT") {
    if (!has(ROLES.ADMIN)) 
      throw new ApiError(400,"Support chat must include admin");
    if (rideId) 
      throw new ApiError(400,"Support chat does not need rideId");
  }
};

// ensures that room is created only once
export const findOrCreateRoom = async ({ roomType, rideId = null, participants }) => {
  if (!roomType) 
    throw new ApiError(400,"roomType is required");
  if (!participants || participants.length < 2) 
    throw new ApiError(400,"participants are required");

  const cleanParticipants = sortParticipants(participants);

  validateRoom({ roomType, rideId, participants: cleanParticipants });

  let room = await ChatRoom.findOne({
    roomType,
    rideId,
    participants: { $size: cleanParticipants.length },
    $and: cleanParticipants.map((p) => ({
      participants: { $elemMatch: { role: p.role, userId: p.userId } },
    })),
  });

  if (!room) {
    room = await ChatRoom.create({
      roomType,
      rideId,
      participants: cleanParticipants,
    });
  }

  return room;
};

// ensures that message is sent only once
export const sendMessage = async ({ roomId, senderRole, senderId, text }) => {
  if (!roomId) 
    throw new ApiError(400, "roomId is required");
  if (!text?.trim()) 
    throw new ApiError(400, "Message text cannot be empty");

  const room = await ChatRoom.findById(roomId);
  if (!room) 
    throw new ApiError(404, "Chat room not found");

  // sender must be participant
  const sender = room.participants.find(
    (p) => p.role === senderRole && String(p.userId) === String(senderId)
  );

  if (!sender) 
    throw new ApiError(403, "You are not allowed to send message in this room");

  // receiver is the other participant (for now: 2 people chat)
  const receiver = room.participants.find(
    (p) => !(p.role === senderRole && String(p.userId) === String(senderId))
  );

  if (!receiver) 
    throw new ApiError(400, "Receiver not found in this room");

  const msg = await Message.create({
    roomId,
    senderRole,
    senderId,
    receiverRole: receiver.role,
    receiverId: receiver.userId,
    text,
  });

  await ChatRoom.findByIdAndUpdate(roomId, { lastMessage: text });

  return msg;
};


// ensures that messages are fetched only once
export const getRoomMessages = async (roomId) => {
  const room = await ChatRoom.findById(roomId);
  if (!room) 
    throw new ApiError(404,"Chat room not found");

  return Message.find({ roomId }).sort({ createdAt: 1 });
};

export const createRoomService = async ({ roomType, rideId = null, user }) => {

  if (!roomType) 
    throw new ApiError(400, "roomType is required");

  let participants = [];

  // SUPPORT CHAT
  if (roomType === "SUPPORT") {

    const admin = await AuthUser.findOne({ role: "ADMIN", accountStatus: "ACTIVE" });

    if (!admin) 
      throw new ApiError(500, "Admin not available");

    participants = [
      { role: user.role, userId: user._id },
      { role: "ADMIN", userId: admin._id }
    ];
  }

  // RIDE CHAT
  if (roomType === "RIDE") {

    if (!rideId) 
      throw new ApiError(400, "rideId is required for ride chat");

    const ride = await Ride.findById(rideId);
    if (!ride) 
      throw new ApiError(404, "Ride not found");

    participants = [
      { role: "USER", userId: ride.userId },
      { role: "DRIVER", userId: ride.driverId }
    ];
  }

  return await findOrCreateRoom({ roomType, rideId, participants });
};
