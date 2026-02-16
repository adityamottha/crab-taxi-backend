import env from "dotenv";
env.config({ path: "./.env" });

import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./db/databaseConn.js";
import { app } from "./app.js";
import { chatSocket } from "./modules/chatRoom/chat.socket.js";

const PORT = process.env.PORT || 8000;

// Create HTTP server from express app
const server = http.createServer(app);

// Create socket server
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket Connected:", socket.id);
  chatSocket(io, socket);
});

// Connect DB then start
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log("✅ BACKEND RUNNING ON PORT", PORT);
    });
  })
  .catch((error) => {
    console.log("❌ MONGO_DB CONNECTION ERROR:- ", error?.message);
  });
