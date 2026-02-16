import { sendMessage } from "../modules/chatRoom/services/chat.service.js";

export const chatSocket = (io, socket) => {
  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("sendMessage", async ({ roomId, senderRole, senderId, text }) => {
    try {
      const msg = await sendMessage({ roomId, senderRole, senderId, text });
      io.to(roomId).emit("newMessage", msg);
    } catch (err) {
      socket.emit("chatError", { message: err.message });
    }
  });
};
