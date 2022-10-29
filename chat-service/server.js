const io = require("socket.io")(3003, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

io.on("connection", socket => {
  socket.on("send-chat-message", ({ message, roomID }) => {
    socket.nsp.to(roomID).emit("chat-message", message);
  })
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log("joined chat room");
  })
})
