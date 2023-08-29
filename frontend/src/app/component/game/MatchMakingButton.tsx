import { SocketContext } from "@/app/socket/SocketProvider";
import { use, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useGameData } from "./GameContext";
import useUserStore, { UserData } from "@/store/useUserStore";
import LoadingScreen from "./LoadingScreen";
import "../chat/ChatBox.css";

interface MatchMakingButtonProps {
  gameMode: string;
  onMatchMaking: () => void;
}

const MatchMakingButton = ({
  gameMode,
  onMatchMaking,
}: MatchMakingButtonProps) => {
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);
  const [roomId, setRoomId] = useState(() => {
    const storedRoomId = sessionStorage.getItem("roomId");
    return storedRoomId ? storedRoomId : null;
  });
  const socket = useContext(SocketContext);
  const [player1User, setPlayer1User] = useState<UserData | null>(null);
  const [player2User, setPlayer2User] = useState<UserData | null>(null);
  const router = useRouter();
  const { setGameState } = useGameData();

  useEffect(() => {
    // console.log("MatchMakingButton", gameMode);
    if (socket && userData.id) {
      socket?.on("loading-screen", ({ roomId, players }: any) => {
        // console.log("loading-screen");
        // console.log("loading-screen", roomId, players);
        setPlayer1User(players[0].player);
        setPlayer2User(players[1].player);
      });
      socket?.on("opponent-disconnected", () => {
        setRoomId(null);
        setIsMatchmaking(false);
        setPlayer1User(null);
        setPlayer2User(null);
        console.log("opponent-disconnected");
      });
      socket?.on("room-closed", () => {
        console.log("room-closed");
      });
    }
    return () => {
      socket?.off("loading-screen");
      socket?.off("opponent-disconnected");
      socket?.off("room-closed");
    };
  }, [socket, userData, router]);

  // useEffect(() => {
  //   if (userData.id && roomId) {
  //     cancelMatchMaking();
  //   }
  // }, []);


  const handleMatchmaking = () => {
    if (isMatchmaking === false) {
      // console.log("start match");
      onMatchMaking();
      setIsMatchmaking(true);
      socket?.emit("join-room", {
        user: userData,
        gameMode: gameMode,
      });
    } else {
      // console.log("cancel match");
      onMatchMaking();
      cancelMatchMaking();
    }
  };

  const cancelMatchMaking = () => {
    console.log("cancel match");
    socket?.emit("clear-room", {
      roomId: roomId || sessionStorage.getItem("roomId"),
      // userName: userData.username,
      user: userData,
    });
    setRoomId(null);
    setIsMatchmaking(false);
    setPlayer1User(null);
    setPlayer2User(null);
  };

  useEffect(() => {
    socket?.on("in-room", (roomId: string) => {
      setRoomId(roomId);
      sessionStorage.setItem("roomId", roomId);
    });
    socket?.on("joined-room", (roomId: string) => {
      setRoomId(roomId);
      sessionStorage.setItem("roomId", roomId);
    });
    // console.log("roomId", roomId);
    return () => {
      socket?.off("in-room");
      socket?.off("joined-room");
    };
  }, [roomId, isMatchmaking]);


  useEffect(() => {
    if (roomId && isMatchmaking && player1User && player2User) {
      const gameData = {
        roomId,
        player1User,
        player2User,
      };
      setGameState(gameData);
    }
  }, [roomId, isMatchmaking, player1User, player2User, router]);

  return (
    <>
      <button className="bottom-nav-buttons" onClick={handleMatchmaking}>
        {isMatchmaking ? "Matchmaking in progress" : "Matchmaking"}
      </button>
      {roomId && isMatchmaking && player1User && player2User && (
        <LoadingScreen
          player1User={player1User}
          player2User={player2User}
          roomId={roomId}
        />
      )}
    </>
  );
};

export default MatchMakingButton;
