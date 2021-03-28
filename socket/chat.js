module.exports = (io, socket) => {
  socket.on('joinRoom', (roomId) => {
    console.log(socket.rooms);
    socket.join(roomId);
    io.to(roomId).emit('有人进入群聊了！');
  })
}