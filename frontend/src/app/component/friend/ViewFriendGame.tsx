import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import { SocketContext } from '@/app/socket/SocketProvider';

const ViewFriendGame = ({ roomId }: any) => {
  const socket = useContext(SocketContext);
  const [gameData, setGameData] = useState<any>(null);

  useEffect(() => {
    const handleGameUpdate = (data: any) => {
      console.log("handleGameUpdate", data);
      setGameData(data);
    };
    socket?.on("game-update", handleGameUpdate);
    return () => {
      socket?.off("game-update", handleGameUpdate);
    };
  }, [socket]);

  const handleViewGame = () => {
    console.log(`Viewing game of friend with ID: ${roomId}`);
    socket?.emit("view-game", {
      roomId: roomId,
    });
  };

  return (
    <>
      {roomId ? (
        <button
          onClick={handleViewGame}
        >
           <FontAwesomeIcon icon={faGamepad} />
        </button>   
      ) : gameData && (
        <div>
              {gameData.player1.name} vs {gameData.player2.name}
        </div> 
      )}
    </>
  );
};

export default ViewFriendGame;
