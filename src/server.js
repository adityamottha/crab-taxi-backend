import "./config/env.js";

import http from "http";
import  {Server}  from "socket.io";

import { connectDB } from "./db/databaseConn.js";
import { app } from "./app.js";
import { chatSocket } from "./utils/sockets.io.js";
import { rideSocket } from "./utils/sockets.io.js";
import { startDriverStatusJob } from "./utils/driverStatus.job.js";

const PORT = process.env.PORT || 8000;

// Create HTTP server from express app
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket Connected:", socket.id);

  // chat feature
  chatSocket(io, socket);

  // ride / driver location feature
  rideSocket(io, socket);
});

global.io = io;


// START SERVER ---------------------
const startServer = async () => {
  try {
    await connectDB(); 

    startDriverStatusJob(); 

    server.listen(PORT, () => {
      console.log("BACKEND RUNNING ON PORT", PORT);
    });

  } catch (error) {
    console.log("MONGO_DB CONNECTION ERROR:- ", error?.message);
  }
};

startServer();