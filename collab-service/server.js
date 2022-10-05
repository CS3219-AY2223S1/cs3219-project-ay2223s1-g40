const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

io.on("connection", socket => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log("joined collab room");
  }),
  socket.on("send-changes", ({ delta, roomID }) => {
    socket.to(roomID).emit("receive-changes", delta);
  })
})
