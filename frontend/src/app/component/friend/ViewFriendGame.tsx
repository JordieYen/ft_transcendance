import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad } from '@fortawesome/free-solid-svg-icons';

const ViewFriendGame = ({ roomId }: any) => {
  const handleViewGame = () => {
    console.log(`Viewing game of friend with ID: ${roomId}`);
    // Implement the logic to view the game using the friendId
    // For example, navigate to the game view or display game details
  };

  return (
    <>
      {roomId ? (
        <button
          onClick={handleViewGame}
        >
           <FontAwesomeIcon icon={faGamepad} />
        </button>
      ) : null}
    </>
  );
};

export default ViewFriendGame;
