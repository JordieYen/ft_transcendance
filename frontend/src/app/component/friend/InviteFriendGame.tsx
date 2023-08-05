import { UserData } from "@/store/useUserStore";
import React from "react";
import { Socket } from "socket.io-client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

interface InviteFriendGameProps {
  user: UserData;
  friend: UserData;
  socket: Socket<any, any> | null;
}

// take in current user, friend user
const InviteFriendGame = ({ user, friend, socket}: InviteFriendGameProps) => {

  const handleInviteFriendGame = () => {
   
    console.log(`Inviting friend to game`);
    console.log(`User:`, user);
    console.log(`Friend:`, friend);
    socket?.emit('invite-game', {
      user: user,
      friend: friend,
    });

    
    // Implement the logic to invite a friend to a game
    // For example, send a request to the backend to invite a friend to a game
    // need a notification to the friend
  };

  return (
    <>
        <button
          onClick={handleInviteFriendGame}
        >
          <FontAwesomeIcon icon={faEnvelope} />
        </button>
    </>
  );
};

export default InviteFriendGame;
