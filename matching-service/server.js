import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from "socket.io";
import { respond } from './controller/match-controller.js';
import "dotenv/config";

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
    origin: '*',
  },
});

// handling over the io logic to the controller
respond(io);

httpServer.listen(process.env.PORT);
