import { ormCreateMatch as _createMatch, ormGetAvailableMatch as _getAvailableMatch, ormDestroyMatch as _destroyMatch} from '../model/match-orm.js'
import fetch from "cross-fetch";

export const respond = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("request-match", async ({ userId, difficulty }) => {
      console.log("match requested");
      const availableMatch = await getAvailableMatch(userId, difficulty);
      if (!availableMatch) {
        await createMatch(userId, socket.id, difficulty);
      } else {
        const hostPlayer = availableMatch.dataValues.hostPlayer;
        io.emit("match-success", { hostPlayer, guestPlayer: userId });
      }
    })

    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log("match successful!");
    })

    socket.on("cancel-match", async () => {
      await destroyMatch(socket.id);
      console.log("match cancelled");
    })
    
    socket.on("leave-room", (roomId) => {
      socket.leave(roomId);
      console.log("left room");
    })

    socket.on("disconnect", async () => {
      console.log("client disconnected");
      await destroyMatch(socket.id);
    })

    // nsp => including myself
    socket.on("request-question", async ({ difficulty, roomID }) => {
      const response = await fetch('http://question-service-env.eba-smjqhekw.ap-southeast-1.elasticbeanstalk.com/questions/difficulty/' 
        + difficulty);
      console.log(response);
      const question = await response.json();
      socket.nsp.to(roomID).emit("distribute-question", question);
    })
  });
}

const getAvailableMatch = async (userId, difficulty) => {
  const resp = await _getAvailableMatch(userId, difficulty);
  return resp;
}

const createMatch = async (hostPlayer, hostSocket, difficulty) => {
  try {
    const resp = await _createMatch(hostPlayer, hostSocket, difficulty);
    if (resp.err) {
      return;
      // return res.status(400).json({message: 'Could not create a new match!'});
    } else {
      console.log(`Created new match ${hostPlayer} successfully!`)
      return;
      // return res.status(201).json({message: `Created new match ${hostPlayer} successfully!`});
    }
  } catch (err) {
    return;
    // return res.status(500).json({message: 'Database failure when creating new match!'})
  }
}

const destroyMatch = async (hostSocket) => {
    await _destroyMatch(hostSocket);
}
