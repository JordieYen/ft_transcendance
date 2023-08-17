import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGamepad } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "@/app/socket/SocketProvider";
import router from "next/router";
import { useGameData } from "../game/GameContext";

const ViewFriendGame = ({ roomId }: any) => {
  const socket = useContext(SocketContext);
  const { setGameState } = useGameData();

  useEffect(() => {
    const handleGameUpdate = (data: any) => {
      setGameState(data);
      router.push("/game");
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
      {roomId && (
        <button onClick={handleViewGame}>
          <FontAwesomeIcon icon={faGamepad} />
        </button>
      )}
    </>
  );
};

export default ViewFriendGame;
