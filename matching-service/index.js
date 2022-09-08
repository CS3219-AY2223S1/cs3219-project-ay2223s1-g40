import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from "socket.io";
import { respond } from './controller/match-controller.js';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from matching-service');
});

const httpServer = createServer(app);
const io = new Server(httpServer, { 
  cors: {
    origin: ["http://localhost:3000"],
  },
});

io.on("connection", (socket) => {
    console.log("a user connected");
    // handling over the socket logic to the controller
    respond(socket);
  });

httpServer.listen(8001);
