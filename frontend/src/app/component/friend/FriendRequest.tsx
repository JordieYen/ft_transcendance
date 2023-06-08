import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const FriendRequest = ( {userId } : any) => {
    const [friendRequests, setFriendRequests] = useState<any[]>([]);

    useEffect(() => {

        const socket = io('http://localhost:3000');
        socket.on('friend-request', handleFriendRequestReceived);
        return () => {
            socket.off('friend-request', handleFriendRequestReceived);
            socket.disconnect();
        };
        // fetchFriendRequests();
    }, []);

    const handleFriendRequestReceived = (friendRequest: any) => {
        setFriendRequests([...friendRequest]);
        console.log('here friendRequest', friendRequest);
        
    };

    // const fetchFriendRequests = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:3000/friend/friend-requests/${userId}`, {
    //             credentials: 'include',
    //         });
    //         if (response.ok) {
    //             const friendRequests = await response.json();
    //             console.log('requests', friendRequests);
    //             setFriendRequests(friendRequests);
    //         } else {
    //             throw new Error('Failed to fetch friend requests');
    //         }
    //     } catch (error) {
    //         console.log('Error fetching friend requests:', error);
    //     }
    // };

    return (
        <div className="friend-request">
          <h1>Friend Requests</h1>
          { friendRequests.length > 0 ? (
            friendRequests.map((friendRequest) => (
            <div key={friendRequest?.id}>
              <p>Id: {friendRequest?.id}</p>
              <p>Sender: {friendRequest?.sender?.username}</p>
              <p>Receiver: {friendRequest?.receiver?.username}</p>
              <p>Status: {friendRequest?.status}</p>
            </div>
          ))) : (
            <p>No friend requests sent</p>
          )}
        </div>
      );
};

export default FriendRequest;
