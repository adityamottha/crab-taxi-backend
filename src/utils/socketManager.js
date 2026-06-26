import { Server } from 'socket.io';
import { chatSocket, rideSocket } from './sockets.io.js';
import logger from './logger.js';
import { verifyJWT } from '.././middlewares/authVerifyJwt.middleware.js';

export const initializeSockets = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use(verifyJWT);

  io.on('connection', (socket) => {
    logger.info(`New socket connection: ${socket.id}`);

    // Initialize chat socket handlers
    chatSocket(io, socket);

    // Initialize ride socket handlers
    rideSocket(io, socket);

    // Connection confirmation
    socket.emit('connected', {
      socketId: socket.id,
      userId: socket.userId,
      timestamp: new Date().toISOString()
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      logger.error('Connection error:', error);
    });
  });

  return io;
};
