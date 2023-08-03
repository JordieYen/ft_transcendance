import { SocketContext } from "@/app/socket/SocketProvider";
import { UserData } from "@/store/useUserStore";
import { use, useContext, useEffect, useState } from "react";
import game from "../../../../pages/game";
import { GameContext, useGameData } from "./GameContext";
import InvitationPopup from "./InvitationPopup";
import LoadingScreen from "./LoadingScreen";

const GameInvitationListener = () => {
  const { clearGameInvitation, handleInviteGame, gameInvitation } =
    useContext(GameContext);
  const socket = useContext(SocketContext);
  const [showPopup, setShowPopup] = useState(false);
  const { setGameState, isLoadingScreenVisible, player1User, player2User } =
    useGameData();

  useEffect(() => {
    console.log("GameInvitationListener");
    console.log(
      "players from game state",
      player1User,
      player2User,
      isLoadingScreenVisible,
    );
    // socket?.on('invite-game', (data: any) => handleInviteGame(data));
    const handleInvite = (data: { user: UserData; friend: UserData }) => {
      handleInviteGame(data);
    };

    socket?.on("invite-game", handleInvite);
    return () => {
      socket?.off("invite-game", handleInviteGame);
      clearGameInvitation();
    };
  }, [socket]);

  return (
    <>
      {gameInvitation && (
        <InvitationPopup
          user={gameInvitation.user}
          friend={gameInvitation.friend}
          onAccept={gameInvitation.onAccept}
          onDecline={gameInvitation.onDecline}
        />
      )}
      {isLoadingScreenVisible && player1User && player2User && (
        <LoadingScreen player1User={player1User} player2User={player2User} />
      )}
    </>
  );
};

export default GameInvitationListener;
