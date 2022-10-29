const io = require("socket.io")(3003, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

io.on("connection", socket => {
  socket.on("send-chat-message", ({ message, roomID }) => {
    socket.to(roomID).emit("chat-message", message);
  })
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log("joined chat room");
  })
  socket.on("notify-leave-room", (roomId) => {
    socket.to(roomId).emit("notify-leave-room");
  })
})
