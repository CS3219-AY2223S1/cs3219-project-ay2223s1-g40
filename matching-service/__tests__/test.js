const io = require("socket.io-client");
const ev = require("./utils/events");
const logger = require("./utils/logger");

// initSocket returns a promise
// success: resolve a new socket object
// fail: reject a error
const initSocket = () => {
  return new Promise((resolve, reject) => {
    // create socket for communication
    const port = process.env.PORT || 8001;
    const socket = io(`localhost:${port}`, {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
    });

    // define event handler for successful connection
    socket.on(ev.CONNECT, () => {
      logger.info("connected");
      resolve(socket);
    });

    // if connection takes longer than 5 seconds throw error
    setTimeout(() => {
      reject(new Error("Failed to connect wihtin 5 seconds."));
    }, 5000);
  });
};

// destroySocket returns a promise
// success: resolve true
// fail: resolve false
const destroySocket = (socket) => {
  return new Promise((resolve, reject) => {
    // check if socket connected
    if (socket.connected) {
      // disconnect socket
      logger.info("disconnecting...");
      socket.disconnect();
      resolve(true);
    } else {
      // not connected
      logger.info("no connection to break...");
      resolve(false);
    }
    logger.info("---------------------------------");
  });
};

describe("Match between two different users should work", () => {
  test("test: request-match", async () => {
    // create socket for communication
    const socketClient1 = await initSocket();
    const socketClient2 = await initSocket();

    // create new promise for server response
    const serverResponse = new Promise((resolve, reject) => {
      // define a handler for the test event
      socketClient2.on(ev.res_SUCCESS, (data4Client) => {
        //process data received from server
        const { hostPlayer, guestPlayer } = data4Client;
        logger.info("Server says: " + hostPlayer + " " + guestPlayer);

        // destroy socket after server responds
        destroySocket(socketClient1);
        destroySocket(socketClient2);

        // return data for testing
        resolve(data4Client);
      });

      // if response takes longer than 5 seconds throw error
      setTimeout(() => {
        reject(new Error("Failed to get reponse, connection timed out..."));
      }, 5000);
    });

    // define data 4 server
    const data4Server1 = { userId: "123", difficulty: "beginner" };
    const data4Server2 = { userId: "456", difficulty: "beginner" };

    // emit event with data to server
    logger.info("Emitting request-match event");
    socketClient2.emit(ev.req_REQ, data4Server2);
    socketClient1.emit(ev.req_REQ, data4Server1);

    // wait for server to respond
    const {hostPlayer, guestPlayer} = await serverResponse;

    // check the response data
    expect(hostPlayer).toBe("123");
    expect(guestPlayer).toBe("456");
  });
});
