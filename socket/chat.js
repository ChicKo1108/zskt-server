module.exports = (io, socket) => {
  // 加入房间
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    // io.to(roomId).emit('joinRoom', '加入群聊');
    // 接受消息
    socket.on('send_chat_msg', (msgVo) => {
      msgVo = JSON.parse(msgVo);
      socket.to(msgVo.roomId).emit('receive_chat_msg', JSON.stringify(msgVo));
    })
    // 离开房间
    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
    })
  })
}