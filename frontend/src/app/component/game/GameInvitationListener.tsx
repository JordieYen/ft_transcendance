import { SocketContext } from "@/app/socket/SocketProvider";
import { UserData } from "@/store/useUserStore";
import { use, useContext, useEffect, useState } from "react";
import game from "../../../../pages/game";
import { GameContext } from "./GameContext";
import InvitationPopup from "./InvitationPopup";

const GameInvitationListener = () => {
    const { clearGameInvitation, handleInviteGame, gameInvitation } = useContext(GameContext);
    const socket = useContext(SocketContext);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        console.log('GameInvitationListener');
        // socket?.on('invite-game', (data: any) => handleInviteGame(data));
        const handleInvite = (data: {user: UserData; friend: UserData}) => {
            handleInviteGame(data);
        };

        socket?.on('invite-game', handleInvite);
        return () => {
            socket?.off('invite-game', handleInviteGame);
            clearGameInvitation();
        };
    }, [socket]);

    console.log('game invite', gameInvitation);


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
        </>
    )
};

export default GameInvitationListener;
