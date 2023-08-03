import React from 'react';


const ViewFriendGame = ({ roomId }: any) => {
  const handleViewGame = () => {
    console.log(`Viewing game of friend with ID: ${roomId}`);
    // Implement the logic to view the game using the friendId
    // For example, navigate to the game view or display game details
  };

  return (
    <>
      {roomId ? (
        <div
          className="bg-blue-500 my-2 text-white px-4 py-2 rounded cursor-pointer"
          onClick={handleViewGame}
        >
          In game
        </div>
      ) : null}
    </>
  );
};

export default ViewFriendGame;
