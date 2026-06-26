// import { sendMessage } from "../modules/chatRoom/services/chat.service.js";
// import { DriverProfile } from "../modules/driver/models/driverProfile.model.js"
// import { onlineDrivers } from "./onlineDrivers.js";
// import { updateDriverLocationService } from "../modules/driver/services/driverProfile.service.js";
// import {
//   acceptRideService,
//   startRideService,
//   completeRideService
// } from "../modules/ride matching/services/ride.service.js";

// // CHAT SOCKET ---------------------------------------------
// const chatSocket = (io, socket) => {
//   socket.on("joinRoom", ({ roomId }) => {
//     socket.join(roomId);
//   });

//   socket.on("sendMessage", async ({ roomId, senderRole, senderId, text }) => {
//     try {
//       const msg = await sendMessage({ roomId, senderRole, senderId, text });
//       io.to(roomId).emit("newMessage", msg);
//     } catch (err) {
//       socket.emit("chatError", { message: err.message });
//     }
//   });
// };

// const rideSocket = (io, socket) => {

//   // DRIVER ONLINE
//   socket.on("driver-online", (userId) => {

//     onlineDrivers.set(
//       userId,
//       socket.id
//     );

//     console.log("\n========== DRIVER ONLINE ==========");
//     console.log("Driver ID:", userId);
//     console.log("Socket ID:", socket.id);
//     console.log(
//       "Current Online Drivers:",
//       [...onlineDrivers.entries()]
//     );
//     console.log("===================================\n");

//   });

//   // USER ONLINE
//   socket.on("user-online", (userId) => {

//     socket.join(
//       `user-${userId}`
//     );

//     console.log("\n========== USER ONLINE ==========");
//     console.log("User ID:", userId);
//     console.log("Socket ID:", socket.id);
//     console.log("=================================\n");

//   });

//   // ACCEPT RIDE
//   socket.on(
//     "acceptRide",
//     async ({
//       rideId,
//       driverId
//     }) => {

//       try {

//         console.log(
//           "ACCEPT RIDE EVENT RECEIVED"
//         );

//         const ride =
//           await acceptRideService({
//             rideId,
//             driverId
//           });

//         socket.emit(
//           "rideAssigned",
//           {
//             rideId: ride._id,
//             pickup: ride.pickup,
//             dropoff: ride.dropoff,
//             fare: ride.fare,
//             status: ride.status
//           }
//         );

//         io.to(
//           `user-${ride.passengerId}`
//         ).emit(
//           "rideAccepted",
//           {
//             rideId: ride._id,
//             driverId: ride.driverId,
//             otp: ride.otp,
//             pickup: ride.pickup,
//             dropoff: ride.dropoff,
//             fare: ride.fare,
//             status: ride.status
//           }
//         );

//       } catch (error) {

//         socket.emit(
//           "rideError",
//           {
//             message: error.message
//           }
//         );

//       }

//       console.log(
//         "rideAssigned emitted to driver"
//       );

//       console.log(
//         "rideAccepted emitted to user"
//       );

//     }
//   );

//   // START RIDE
//   socket.on(
//     "startRide",
//     async ({
//       rideId,
//       otp
//     }) => {

//       try {
//         console.log(
//           "START RIDE EVENT RECEIVED"
//         );
//         const ride =
//           await startRideService({
//             rideId,
//             otp
//           });

//         socket.emit(
//           "rideStarted",
//           {
//             rideId: ride._id,
//             status: ride.status
//           }
//         );

//         io.to(
//           `user-${ride.passengerId}`
//         ).emit(
//           "rideStarted",
//           {
//             rideId: ride._id,
//             status: ride.status
//           }
//         );

//       } catch (error) {

//         socket.emit(
//           "rideError",
//           {
//             message: error.message
//           }
//         );

//       }
//       console.log(
//         "rideStarted emitted"
//       );
//     }
//   );

//   // COMPLETE RIDE
//   socket.on(
//     "completeRide",
//     async ({
//       rideId,
//       driverId
//     }) => {

//       try {
//         console.log(
//           "COMPLETE RIDE EVENT RECEIVED"
//         );
//         const ride =
//           await completeRideService({
//             rideId,
//             driverId
//           });

//         socket.emit(
//           "rideCompleted",
//           {
//             rideId: ride._id,
//             status: ride.status
//           }
//         );

//         io.to(
//           `user-${ride.passengerId}`
//         ).emit(
//           "rideCompleted",
//           {
//             rideId: ride._id,
//             status: ride.status
//           }
//         );

//       } catch (error) {

//         socket.emit(
//           "rideError",
//           {
//             message: error.message
//           }
//         );

//       }
//       console.log(
//         "rideCompleted emitted"
//       );
//     }
//   );

//   // DRIVER LOCATION
//   socket.on("driverLocation", async (data) => {
//    console.log("driverLocation received");
//     console.log(data); 

//     try {

//       const { userId, lat, lng } = data;

//       const driver = await updateDriverLocationService(
//         userId,
//         lat,
//         lng
//       );

//       console.log({
//       driverId: driver.authUserId,
//       lat,
//       lng,
//       updatedAt: driver.lastSeen
//     });

//       io.emit("driverMoved", {
//         driverId: driver.authUserId,
//         lat,
//         lng
//       });

//     } catch (err) {

//       console.log("Driver Location Error:", err.message);

//       socket.emit("error", {
//         message: err.message
//       });

//     }

//   });

// };

//   // DISCONNECT
//   socket.on(
//     "disconnect",
//     () => {

//       for (
//         const [userId, socketId]
//         of onlineDrivers.entries()
//       ) {

//         if (
//           socketId === socket.id
//         ) {

//           onlineDrivers.delete(
//             userId
//           );

//           console.log(
//             "Driver Offline:",
//             userId
//           );

//           break;
//         }

//       }

//     }
//   );





import { sendMessage } from "../modules/chatRoom/services/chat.service.js";
import { updateDriverLocationService } from "../modules/driver/services/driverProfile.service.js";
import {
  acceptRideService,
  startRideService,
  completeRideService
} from "../modules/ride matching/services/ride.service.js";
import {onlineDrivers,driverManager} from "./onlineDrivers.js";
import { logger } from "./logger.js";

// Configuration
const CONFIG = {
  RATE_LIMIT_MS: parseInt(process.env.RATE_LIMIT_MS) || 1000,
  MAX_MESSAGE_LENGTH: parseInt(process.env.MAX_MESSAGE_LENGTH) || 1000,
  PING_INTERVAL: parseInt(process.env.PING_INTERVAL) || 25000,
  PING_TIMEOUT: parseInt(process.env.PING_TIMEOUT) || 20000,
  MAX_LOCATION_HISTORY: parseInt(process.env.MAX_LOCATION_HISTORY) || 100
};

// Rate limiting map for location updates
const locationUpdateTimestamps = new Map();
// Store location history for debugging
const locationHistory = new Map();

/**
 * Chat Socket Handler
 * Handles all chat-related socket events
 */
 const chatSocket = (io, socket) => {
  // Set max listeners to prevent memory leaks
  socket.setMaxListeners(20);

  /**
   * Join a chat room
   */
  socket.on("joinRoom", ({ roomId }) => {
    if (!roomId) {
      socket.emit("chatError", { message: "Room ID required" });
      return;
    }

    try {
      socket.join(roomId);
      logger.debug(`Socket ${socket.id} joined room ${roomId}`);
      
      // Notify others in the room
      socket.to(roomId).emit("userJoined", {
        userId: socket.userId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error("Error joining room", { roomId, error: error.message });
      socket.emit("chatError", { message: "Failed to join room" });
    }
  });

  /**
   * Send a message to a chat room
   */
  socket.on("sendMessage", async ({ roomId, senderRole, senderId, text }) => {
    // Validate input
    if (!roomId || !senderId || !text) {
      socket.emit("chatError", { message: "Missing required fields" });
      return;
    }

    if (text.length > CONFIG.MAX_MESSAGE_LENGTH) {
      socket.emit("chatError", { 
        message: `Message too long (max ${CONFIG.MAX_MESSAGE_LENGTH} characters)` 
      });
      return;
    }

    if (text.trim().length === 0) {
      socket.emit("chatError", { message: "Message cannot be empty" });
      return;
    }

    try {
      const msg = await sendMessage({ 
        roomId, 
        senderRole, 
        senderId, 
        text: text.trim() 
      });
      
      io.to(roomId).emit("newMessage", msg);
      logger.debug("Message sent", { roomId, senderId, messageLength: text.length });
    } catch (err) {
      logger.error("Chat error", { roomId, error: err.message });
      socket.emit("chatError", { message: err.message });
    }
  });

  /**
   * Typing indicator
   */
  socket.on("typing", ({ roomId, userId, isTyping }) => {
    if (!roomId || !userId) return;
    socket.to(roomId).emit("userTyping", { userId, isTyping });
  });

  /**
   * Mark messages as read
   */
  socket.on("markAsRead", async ({ roomId, userId, messageIds }) => {
    if (!roomId || !userId || !messageIds) {
      socket.emit("chatError", { message: "Missing required fields" });
      return;
    }

    try {
      // Assuming you have a service for this
      // await markMessagesAsReadService({ roomId, userId, messageIds });
      io.to(roomId).emit("messagesRead", { userId, messageIds });
      logger.debug("Messages marked as read", { roomId, userId, count: messageIds.length });
    } catch (error) {
      logger.error("Error marking messages as read", { roomId, error: error.message });
    }
  });

  /**
   * Leave a chat room
   */
  socket.on("leaveRoom", ({ roomId }) => {
    if (roomId) {
      socket.leave(roomId);
      socket.to(roomId).emit("userLeft", {
        userId: socket.userId,
        timestamp: new Date().toISOString()
      });
      logger.debug(`Socket ${socket.id} left room ${roomId}`);
    }
  });
};

/**
 * Ride Socket Handler
 * Handles all ride-related socket events
 */
const rideSocket = (io, socket) => {
  // Set max listeners
  socket.setMaxListeners(20);

  /**
   * Driver goes online
   */
  socket.on("driverOnline", (userId) => {
    if (!userId) {
      socket.emit("error", { message: "User ID required" });
      return;
    }

    // Store userId on socket for cleanup
    socket.userId = userId;
    socket.userType = "driver";
    socket.isOnline = true;

    // Check if already online
    if (onlineDrivers.has(userId)) {
      const oldSocketId = onlineDrivers.get(userId);
      if (oldSocketId !== socket.id) {
        logger.warn(`Driver ${userId} already online with different socket, updating`);
        onlineDrivers.delete(userId);
        
        // Notify old socket if it exists
        const oldSocket = io.sockets.sockets.get(oldSocketId);
        if (oldSocket) {
          oldSocket.emit("sessionReplaced", { 
            message: "Another session has taken over" 
          });
          oldSocket.disconnect(true);
        }
      }
    }

    onlineDrivers.set(userId, socket.id);
    socket.join(`driver-${userId}`);
    
    logger.info(`Driver ${userId} online`, { socketId: socket.id });
    
    // Broadcast to all clients
    io.emit("driverStatusChanged", { 
      driverId: userId, 
      status: "online",
      timestamp: new Date().toISOString()
    });

    // Send current online drivers list to the driver
    socket.emit("onlineDriversList", {
      drivers: [...onlineDrivers.keys()]
    });
  });

  /**
   * User goes online
   */
  socket.on("userOnline", (userId) => {
    if (!userId) {
      socket.emit("error", { message: "User ID required" });
      return;
    }

    socket.userId = userId;
    socket.userType = "user";
    socket.isOnline = true;
    socket.join(`user-${userId}`);
    
    logger.info(`User ${userId} online`, { socketId: socket.id });
    
    // Send available drivers to user
    socket.emit("availableDrivers", {
      drivers: [...onlineDrivers.keys()]
    });
  });

  /**
   * Accept a ride
   */
  socket.on("acceptRide", async ({ rideId, driverId }) => {
    // Input validation
    if (!rideId || !driverId) {
      socket.emit("rideError", { message: "Missing rideId or driverId" });
      return;
    }

    // Check if driver is still online
    if (!onlineDrivers.has(driverId)) {
      socket.emit("rideError", { message: "Driver is offline" });
      return;
    }

    try {
      logger.info("Accepting ride", { rideId, driverId });
      
      const ride = await acceptRideService({ rideId, driverId });

      if (!ride) {
        throw new Error("Ride not found or already assigned");
      }

      // Emit to driver
      socket.emit("rideAssigned", {
        rideId: ride._id,
        pickup: ride.pickup,
        dropoff: ride.dropoff,
        fare: ride.fare,
        status: ride.status,
        passengerId: ride.passengerId,
        estimatedTime: ride.estimatedTime || 5, // Default 5 minutes
        timestamp: new Date().toISOString()
      });

      // Emit to passenger
      io.to(`user-${ride.passengerId}`).emit("rideAccepted", {
        rideId: ride._id,
        driverId: ride.driverId,
        driverDetails: ride.driverDetails || {},
        otp: ride.otp,
        pickup: ride.pickup,
        dropoff: ride.dropoff,
        fare: ride.fare,
        status: ride.status,
        estimatedArrival: ride.estimatedArrival || new Date(Date.now() + 5 * 60000),
        timestamp: new Date().toISOString()
      });

      // Notify other drivers that ride is taken
      io.emit("rideTaken", {
        rideId: ride._id,
        driverId: ride.driverId
      });

      logger.info("Ride accepted successfully", { rideId, driverId });
    } catch (error) {
      logger.error("Error accepting ride", { rideId, driverId, error: error.message });
      socket.emit("rideError", { message: error.message });
    }
  });

  /**
   * Start a ride
   */
  socket.on("startRide", async ({ rideId, otp }) => {
    if (!rideId || !otp) {
      socket.emit("rideError", { message: "Missing rideId or OTP" });
      return;
    }

    try {
      logger.info("Starting ride", { rideId });
      const ride = await startRideService({ rideId, otp });

      if (!ride) {
        throw new Error("Invalid OTP or ride not found");
      }

      const startTime = new Date().toISOString();

      socket.emit("rideStarted", {
        rideId: ride._id,
        status: ride.status,
        startTime: startTime,
        estimatedDuration: ride.estimatedDuration || 30 // Default 30 minutes
      });

      io.to(`user-${ride.passengerId}`).emit("rideStarted", {
        rideId: ride._id,
        status: ride.status,
        startTime: startTime,
        driverLocation: {
          lat: ride.driverLocation?.lat || 0,
          lng: ride.driverLocation?.lng || 0
        }
      });

      logger.info("Ride started successfully", { rideId });
    } catch (error) {
      logger.error("Error starting ride", { rideId, error: error.message });
      socket.emit("rideError", { message: error.message });
    }
  });

  /**
   * Update driver location
   */
  socket.on("updateDriverLocation", async (data) => {
    let parsedData = data;
    
    // Handle if data comes as string
    if (typeof data === 'string') {
      try {
        parsedData = JSON.parse(data);
      } catch (error) {
        socket.emit("error", { message: "Invalid data format" });
        return;
      }
    }

    const { userId, lat, lng, rideId } = parsedData;

    // Validation
    if (!userId || lat === undefined || lng === undefined) {
      socket.emit("error", { message: "Missing required fields" });
      return;
    }

    // Validate coordinates
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      socket.emit("error", { message: "Invalid coordinates" });
      return;
    }

    // Rate limiting
    const now = Date.now();
    const lastUpdate = locationUpdateTimestamps.get(userId) || 0;
    if (now - lastUpdate < CONFIG.RATE_LIMIT_MS) {
      return; // Ignore too-frequent updates
    }
    locationUpdateTimestamps.set(userId, now);

    // Store location history
    if (!locationHistory.has(userId)) {
      locationHistory.set(userId, []);
    }
    const history = locationHistory.get(userId);
    history.push({ lat, lng, timestamp: now });
    if (history.length > CONFIG.MAX_LOCATION_HISTORY) {
      history.shift();
    }

    try {
      const driver = await updateDriverLocationService(userId, lat, lng);

      // Broadcast to all clients
      io.emit("driverMoved", {
        driverId: driver.authUserId,
        lat,
        lng,
        timestamp: new Date().toISOString(),
        rideId: rideId || null
      });

      // If driver is on a ride, update passenger
      if (rideId) {
        io.to(`ride-${rideId}`).emit("driverLocationUpdated", {
          rideId,
          lat,
          lng,
          timestamp: new Date().toISOString()
        });
      }

      // Send confirmation to driver
      io.to(`driver-${driver.authUserId}`).emit("locationUpdated", {
        status: "success",
        lat,
        lng,
        timestamp: new Date().toISOString()
      });

      logger.debug("Driver location updated", { driverId: userId, lat, lng });
    } catch (err) {
      logger.error("Driver location error", { userId, error: err.message });
      socket.emit("error", { message: err.message });
    }
  });

  /**
   * Complete a ride
   */
  socket.on("completeRide", async ({ rideId, driverId }) => {
    if (!rideId || !driverId) {
      socket.emit("rideError", { message: "Missing rideId or driverId" });
      return;
    }

    try {
      logger.info("Completing ride", { rideId, driverId });
      
      const ride = await completeRideService({ rideId, driverId });

      if (!ride) {
        throw new Error("Ride not found");
      }

      const completionData = {
        rideId: ride._id,
        status: ride.status,
        completionTime: new Date().toISOString(),
        fare: ride.finalFare || ride.fare,
        distance: ride.totalDistance || 0,
        duration: ride.totalDuration || 0
      };

      socket.emit("rideCompleted", completionData);

      io.to(`user-${ride.passengerId}`).emit("rideCompleted", {
        ...completionData,
        driverRating: ride.driverRating || null
      });

      // Notify all drivers that ride is completed
      io.emit("rideCompletedNotification", {
        rideId: ride._id,
        driverId: driverId
      });

      logger.info("Ride completed successfully", { rideId });
    } catch (error) {
      logger.error("Error completing ride", { rideId, error: error.message });
      socket.emit("rideError", { message: error.message });
    }
  });

  /**
   * Cancel a ride
   */
  socket.on("cancelRide", async ({ rideId, userId, reason }) => {
    if (!rideId || !userId) {
      socket.emit("rideError", { message: "Missing rideId or userId" });
      return;
    }

    try {
      logger.info("Cancelling ride", { rideId, userId, reason });
      
      // Assuming you have a cancel ride service
      // const ride = await cancelRideService({ rideId, userId, reason });
      
      // For now, just emit events
      const cancellationData = {
        rideId,
        cancelledBy: userId,
        reason: reason || "Ride cancelled",
        timestamp: new Date().toISOString()
      };

      socket.emit("rideCancelled", cancellationData);
      
      // Find the other party and notify them
      // This would need to be implemented based on your data model
      
      logger.info("Ride cancelled", { rideId, userId });
    } catch (error) {
      logger.error("Error cancelling ride", { rideId, error: error.message });
      socket.emit("rideError", { message: error.message });
    }
  });

  /**
   * Rate a ride
   */
  socket.on("rateRide", async ({ rideId, userId, rating, review }) => {
    if (!rideId || !userId || !rating) {
      socket.emit("error", { message: "Missing required fields" });
      return;
    }

    if (rating < 1 || rating > 5) {
      socket.emit("error", { message: "Rating must be between 1 and 5" });
      return;
    }

    try {
      logger.info("Rating ride", { rideId, userId, rating });
      
      // Assuming you have a rate ride service
      // const result = await rateRideService({ rideId, userId, rating, review });
      
      // For now, just emit confirmation
      socket.emit("rideRated", {
        rideId,
        rating,
        review: review || "",
        timestamp: new Date().toISOString()
      });

      logger.info("Ride rated successfully", { rideId, userId });
    } catch (error) {
      logger.error("Error rating ride", { rideId, error: error.message });
      socket.emit("error", { message: error.message });
    }
  });

  /**
   * Get online drivers
   */
  socket.on("getOnlineDrivers", () => {
    const drivers = [...onlineDrivers.keys()];
    socket.emit("onlineDriversList", { 
      drivers,
      count: drivers.length,
      timestamp: new Date().toISOString()
    });
  });

  /**
   * Disconnect handler
   */
  socket.on("disconnect", (reason) => {
    const userId = socket.userId;
    const userType = socket.userType;

    if (userType === "driver" && userId) {
      // Remove from online drivers
      onlineDrivers.delete(userId);
      
      // Clean up rate limiting
      locationUpdateTimestamps.delete(userId);
      
      // Clean up location history
      locationHistory.delete(userId);
      
      logger.info(`Driver ${userId} offline`, { reason, socketId: socket.id });
      
      // Notify all clients
      io.emit("driverStatusChanged", { 
        driverId: userId, 
        status: "offline",
        timestamp: new Date().toISOString()
      });

      // Leave driver room
      socket.leave(`driver-${userId}`);
      
    } else if (userType === "user" && userId) {
      // Leave user room
      socket.leave(`user-${userId}`);
      logger.info(`User ${userId} offline`, { reason, socketId: socket.id });
      
      // Notify that user went offline if needed
      io.emit("userStatusChanged", {
        userId: userId,
        status: "offline",
        timestamp: new Date().toISOString()
      });
    }

    // Clean up any other resources
    const rooms = Array.from(socket.rooms);
    rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });

    logger.debug(`Socket ${socket.id} disconnected`, { reason });
  });

  /**
   * Heartbeat - Ping
   */
  socket.on("ping", () => {
    socket.emit("pong", {
      timestamp: new Date().toISOString()
    });
  });

  /**
   * Reconnection handler
   */
  socket.on("reconnect", () => {
    logger.info("Client reconnected", { socketId: socket.id });
    
    // Re-emit online status if driver
    if (socket.userId && socket.userType === "driver") {
      socket.emit("driverOnline", socket.userId);
    } else if (socket.userId && socket.userType === "user") {
      socket.emit("userOnline", socket.userId);
    }
  });

  /**
   * Error handler for socket
   */
  socket.on("error", (error) => {
    logger.error("Socket error", { 
      socketId: socket.id, 
      userId: socket.userId,
      error: error.message 
    });
  });
};

// Export both socket handlers
export {
  chatSocket,
  rideSocket
};