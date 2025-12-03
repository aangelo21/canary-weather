// backend/services/websocketService.js

import { Server as SocketIOServer } from "socket.io";

// Internal reference to the Socket.IO server instance.
// This allows us to retrieve the IO instance later via getIO().
let ioInstance = null;

// Define allowed origins for CORS (Cross-Origin Resource Sharing).
// IMPORTANT: When using WSS (WebSocket Secure), the 'Origin' header sent by the browser
// during the handshake is the HTTP/HTTPS origin of the page (e.g., "https://canaryweather.xyz").
// Therefore, we list the HTTPS URL here. We do not need to list "wss://" schemas.
const ALLOWED_ORIGINS = [
  "http://localhost:5173", // Local development
  "http://134.209.22.118:5173", // Staging / Direct IP access
  "https://canaryweather.xyz", // Production domain
];

/**
 * Retrieves the initialized Socket.IO instance.
 * This helper allows other modules (controllers, services) to emit events
 * without needing to pass the io instance around manually.
 *
 * @returns {import('socket.io').Server} The initialized Socket.IO server instance.
 * @throws {Error} If the socket server has not been initialized yet.
 */
export function getIO() {
  if (!ioInstance) {
    throw new Error(
      "Socket.IO has not been initialized. Please call initWebsocket(server) first."
    );
  }
  return ioInstance;
}

/**
 * Initializes the Socket.IO server and configures event listeners.
 * This function attaches Socket.IO to the existing Node.js HTTP/HTTPS server.
 *
 * @param {import('http').Server | import('https').Server} httpServer - The Node.js HTTP or HTTPS server.
 * @returns {import('socket.io').Server} The initialized Socket.IO server.
 */
export default function initWebsocket(httpServer) {
  if (!httpServer) {
    throw new Error(
      "A valid HTTP/HTTPS server instance is required to initialize WebSockets."
    );
  }

  // Create the Socket.IO server instance.
  // We configure CORS to allow connections from our frontend domains.
  ioInstance = new SocketIOServer(httpServer, {
    cors: {
      origin: ALLOWED_ORIGINS,
      credentials: true, // Allow cookies and headers to be passed
      methods: ["GET", "POST"], // Allowed HTTP methods for the handshake
    },
  });

  console.log(
    "Socket.IO server initialized. Allowed CORS origins:",
    ALLOWED_ORIGINS
  );

  // Listen for new client connections
  ioInstance.on("connection", (socket) => {
    console.log(`[WebSocket] Client connected: ${socket.id}`);

    // --- Event Handlers ---

    // 1. Subscribe to Point-Of-Interest (POI) updates.
    // Clients send 'subscribePoi' with a POI ID to receive specific alerts/updates.
    socket.on("subscribePoi", (poiId) => {
      if (!poiId) {
        console.warn(
          `[WebSocket] Client ${socket.id} attempted to subscribe to POI without an ID.`
        );
        return;
      }
      const roomName = `poi_${poiId}`;
      socket.join(roomName);
      // Acknowledge the subscription
      socket.emit("subscribedPoi", { poiId, room: roomName });
      console.log(`[WebSocket] Client ${socket.id} joined room: ${roomName}`);
    });

    // 2. Unsubscribe from POI updates.
    socket.on("unsubscribePoi", (poiId) => {
      if (!poiId) return;
      const roomName = `poi_${poiId}`;
      socket.leave(roomName);
      socket.emit("unsubscribedPoi", { poiId, room: roomName });
      console.log(`[WebSocket] Client ${socket.id} left room: ${roomName}`);
    });

    // 3. Subscribe to general notifications (e.g., system-wide alerts).
    socket.on("subscribeNotifications", () => {
      const roomName = "notifications_general";
      socket.join(roomName);
      socket.emit("subscribedNotifications");
      console.log(
        `[WebSocket] Client ${socket.id} subscribed to general notifications.`
      );
    });

    // 4. Unsubscribe from general notifications.
    socket.on("unsubscribeNotifications", () => {
      const roomName = "notifications_general";
      socket.leave(roomName);
      socket.emit("unsubscribedNotifications");
      console.log(
        `[WebSocket] Client ${socket.id} unsubscribed from general notifications.`
      );
    });

    // 5. Server Time (Health Check).
    // Allows clients to check latency or sync time.
    socket.on("serverTime", () => {
      socket.emit("serverTime", { now: new Date().toISOString() });
    });

    // Handle client disconnection
    socket.on("disconnect", (reason) => {
      console.log(
        `[WebSocket] Client disconnected: ${socket.id} (Reason: ${reason})`
      );
    });
  });

  return ioInstance;
}
