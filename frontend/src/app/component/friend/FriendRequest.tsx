import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface FriendRequestProps {
  userId: number;
  socket: Socket | null;
}

const FriendRequest = ( {userId, socket } : FriendRequestProps) => {
    const [friendRequests, setFriendRequests] = useState<any[]>([]);

    useEffect(() => {

        // const socket = io('http://localhost:3000');
        // fetchFriendRequests();
        socket?.on('friend-request', handleFriendRequestReceived);
        return () => {
            // socket?.off('friend-request', handleFriendRequestReceived);
            // socket?.disconnect();
        };
    }, [socket]);

  const fetchFriendRequests = async () => {
      try {
          const response = await fetch(`http://localhost:3000/friend/friend-requests/${userId}`, {
              credentials: 'include',
          });
          if (response.ok) {
              const friendRequests = await response.json();
              console.log('requests', friendRequests);
              setFriendRequests(friendRequests);
          } else {
              throw new Error('Failed to fetch friend requests');
          }
      } catch (error) {
          console.log('Error fetching friend requests:', error);
      }
  };

  // const handleFriendRequestReceived = (friendRequest: any) => {
  //       setFriendRequests([...friendRequest]);
        // setFriendRequests((prevFriendRequests) => [...prevFriendRequests, friendRequest]);
        // console.log('here friendRequest', friendRequest);
  // };

  const handleFriendRequestReceived = (friendRequest: any) => {
    setFriendRequests( () => {
      const updatedRequest = [...friendRequest];;
      return updatedRequest.sort((a, b) => a.id - b.id);
    })
  };

  return (
      <div className="friend-request flex-col">
        <h1>Friend Requests</h1>
        { friendRequests.length > 0 ? (
          friendRequests.map((friendRequest) => (
          <div key={friendRequest?.id}>
            <p>Id: {friendRequest?.id}</p>
            <p>Sender: {friendRequest?.sender?.username}</p>
            <p>Receiver: {friendRequest?.receiver?.username}</p>
            <p>Status: {friendRequest?.status}</p>
            <div className="flex gap-5 my-5">
              <button>Accept</button>
              <button>Decline</button>
            </div>
          </div>
        ))) : (
          <p>No friend requests sent</p>
        )}
      </div>
    );
};

export default FriendRequest;
