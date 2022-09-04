import { ormCreateMatch as _createMatch, ormGetAvailableMatch as _getAvailableMatch } from '../model/match-orm.js'

export const respond = (socket) => {
  socket.on("request-match", async () => {
    console.log("match requested");

    const availableMatch = await getAvailableMatch();
    if (!availableMatch || !availableMatch.value) {
      createMatch(socket.id);
    } else {
      const hostPlayer = availableMatch.value.hostPlayer;
      socket.broadcast.emit("match-success", hostPlayer, socket.id);
    }
  })
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log("match successful!");
  })
}

const getAvailableMatch = async () => {
  const resp = await _getAvailableMatch();
  return resp;
}

const createMatch = async (hostPlayer) => {
  try {
    const resp = await _createMatch(hostPlayer);
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
