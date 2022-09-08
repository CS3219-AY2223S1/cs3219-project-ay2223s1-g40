import { useEffect, useState } from "react";
import io from 'socket.io-client';

const socket = io("http://localhost:8001");

function Container() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('match-success', (hostPlayer, guestPlayer) => {
        if (socket.id === hostPlayer || socket.id === guestPlayer) {
            socket.emit("join-room", hostPlayer);
        }
    })

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('match-success');
    };
  }, []);

  const findMatch = () => {
    socket.emit("request-match", "intermediate");
  };

  return(
    <div></div>
  );
}

export default Container;
