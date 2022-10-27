const io = require('socket.io')(3003)

const users = {}

io.on('connection', socket => {
  // socket.on('new-user', name => {
  //   users[socket.id] = name
  //   socket.broadcast.emit('user-connected', name)
  // })
  socket.on('send-chat-message', ({ message, roomId }) => {
    socket.to(roomId).emit('chat-message', message);
  })
  // socket.on('disconnect', () => {
  //   socket.broadcast.emit('user-disconnected', users[socket.id])
  //   delete users[socket.id]
  // })
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log("joined chat room");
  })
})