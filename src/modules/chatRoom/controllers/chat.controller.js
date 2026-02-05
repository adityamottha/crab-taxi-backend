import { findOrCreateRoom, sendMessage, getRoomMessages } from "../services/chat.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AuthUser } from "../../auth/authUsers.models.js"

export const createRoom = async (req, res) => {
  const { roomType, rideId = null, otherUserId } = req.body;

  // fetch other user from DB (driver/admin/user)
  const otherUser = await AuthUser.findById(otherUserId).select("_id role");

  // participants built securely
  const participants = [
    { role: req.user.role, userId: req.user._id },
    { role: otherUser.role, userId: _id },
  ];

  const room = await findOrCreateRoom({ participants, roomType, rideId });

  return res
    .status(200)
    .json(new ApiResponse(200, "Room created successfully", room));
};

export const createMessage = async (req, res) => {
  const { roomId, text } = req.body;

  const msg = await sendMessage({
    roomId,
    senderRole: req.user.role,
    senderId: req.user._id,
    text,
  });

  return res.status(200).json(
    new ApiResponse(200, "Message sent successfully", msg)
  );
};

export const fetchMessages = async (req, res) => {
    const { roomId } = req.params;

    const messages = await getRoomMessages(roomId);
    return res.status(200).json(
      new ApiResponse(200, "Messages fetched successfully", messages)
    );
};
