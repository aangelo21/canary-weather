

import { Server as SocketIOServer } from 'socket.io';



let ioInstance = null;





const ALLOWED_ORIGINS = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean);


export function getIO() {
    if (!ioInstance) {
        throw new Error(
            'Socket.IO has not been initialized. Please call initWebsocket(server) first.',
        );
    }
    return ioInstance;
}


export default function initWebsocket(httpServer) {
    if (!httpServer) {
        throw new Error(
            'A valid HTTP/HTTPS server instance is required to initialize WebSockets.',
        );
    }

    
    
    ioInstance = new SocketIOServer(httpServer, {
        cors: {
            origin: ALLOWED_ORIGINS,
            credentials: true, 
            methods: ['GET', 'POST'], 
        },
    });

    
    ioInstance.on('connection', (socket) => {
        

        
        
        socket.on('subscribePoi', (poiId) => {
            if (!poiId) {
                console.warn(
                    `[WebSocket] Client ${socket.id} attempted to subscribe to POI without an ID.`,
                );
                return;
            }
            const roomName = `poi_${poiId}`;
            socket.join(roomName);
            
            socket.emit('subscribedPoi', { poiId, room: roomName });
        });

        
        socket.on('unsubscribePoi', (poiId) => {
            if (!poiId) return;
            const roomName = `poi_${poiId}`;
            socket.leave(roomName);
            socket.emit('unsubscribedPoi', { poiId, room: roomName });
        });

        
        socket.on('subscribeNotifications', () => {
            const roomName = 'notifications_general';
            socket.join(roomName);
            socket.emit('subscribedNotifications');
        });

        
        socket.on('unsubscribeNotifications', () => {
            const roomName = 'notifications_general';
            socket.leave(roomName);
            socket.emit('unsubscribedNotifications');
        });

        
        
        socket.on('serverTime', () => {
            socket.emit('serverTime', { now: new Date().toISOString() });
        });

        
        socket.on('disconnect', (reason) => {});
    });

    return ioInstance;
}
