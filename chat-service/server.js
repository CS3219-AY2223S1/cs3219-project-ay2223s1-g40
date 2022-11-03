import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from "socket.io";
import "dotenv/config";

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from chat-service');
});

const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: '*',
  },
});

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

httpServer.listen(process.env.PORT);
