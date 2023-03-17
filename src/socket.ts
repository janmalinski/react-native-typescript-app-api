let io: any;

module.exports = {
  init: (httpServer: any) => {
    io = require('socket.io')(httpServer);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};