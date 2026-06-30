const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// Almacenar usuarios conectados: userId -> socketId
const connectedUsers = new Map();

// Almacenar conversaciones activas: conversationId -> [socketIds]
const activeConversations = new Map();

io.on('connection', (socket) => {
  console.log(`[Socket] Cliente conectado: ${socket.id}`);

  // Registrar usuario
  socket.on('join-user', (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`[Socket] Usuario ${userId} unido`);
  });

  // Unirse a conversación
  socket.on('join-conversation', (conversationId) => {
    // Salir de otras conversaciones primero
    socket.rooms.forEach((room) => {
      if (room.startsWith('conversation-') && room !== `conversation-${conversationId}`) {
        socket.leave(room);
        console.log(`[Socket] Socket ${socket.id} salió de ${room}`);
      }
    });

    // Unirse a la nueva conversación
    socket.join(`conversation-${conversationId}`);

    if (!activeConversations.has(conversationId)) {
      activeConversations.set(conversationId, []);
    }
    activeConversations.get(conversationId).push(socket.id);

    console.log(`[Socket] Socket ${socket.id} unido a conversación ${conversationId}`);
    console.log(`[Socket] Usuarios en conversación: ${io.sockets.adapter.rooms.get(`conversation-${conversationId}`).size}`);
  });

  // Recibir mensaje
  socket.on('send-message', (data) => {
    const { conversationId, message } = data;

    // Broadcast a TODOS los clientes (no solo a los en la sala)
    io.emit('new-message', {
      conversationId,
      message,
      timestamp: new Date().toISOString(),
    });

    console.log(`[Socket] Mensaje en conversación ${conversationId}:`, message.content.substring(0, 30));
  });

  // Marcar como leído
  socket.on('mark-read', (conversationId) => {
    io.to(`conversation-${conversationId}`).emit('messages-marked-read', {
      conversationId,
    });
  });

  // Desconectar
  socket.on('disconnect', () => {
    // Remover usuario
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }

    // Remover de conversaciones
    for (const [convId, sockets] of activeConversations.entries()) {
      const index = sockets.indexOf(socket.id);
      if (index > -1) {
        sockets.splice(index, 1);
      }
    }

    console.log(`[Socket] Cliente desconectado: ${socket.id}`);
  });
});

const PORT = process.env.SOCKET_PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🔌 Socket.io servidor en puerto ${PORT}`);
});
