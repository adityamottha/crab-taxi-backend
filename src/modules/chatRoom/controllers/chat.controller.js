import { createRoomService, sendMessage, getRoomMessages } from "../services/chat.service.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { AsyncHandler } from "../../../utils/AsyncHandler.js";

export const createRoom = AsyncHandler(async (req, res) => {

  const { roomType, rideId = null } = req.body;

  const room = await createRoomService({
    roomType,
    rideId,
    user: req.user
  });

  return res.status(200).json(
    new ApiResponse(200, room, "Room created successfully")
  );
});

export const createMessage = AsyncHandler(async (req, res) => {

  const { roomId, text } = req.body;

  const msg = await sendMessage({
    roomId,
    senderRole: req.user.role,
    senderId: req.user._id,
    text
  });

  return res.status(200).json(
    new ApiResponse(200, msg, "Message sent successfully")
  );
});

export const fetchMessages = AsyncHandler(async (req, res) => {

  const messages = await getRoomMessages(req.params.roomId);

  return res.status(200).json(
    new ApiResponse(200, messages, "Messages fetched successfully")
  );
});
