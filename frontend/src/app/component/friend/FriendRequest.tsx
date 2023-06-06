import { useEffect, useState } from "react";

interface FriendRequestProps {
    userId: any;
}

interface FriendRequestData {
    sentFriendRequest: any[];
    receivedFriendRequest: any[];
}

const FriendRequest = ( {userId } : FriendRequestProps) => {
    const [friendRequests, setFriendRequests] = useState<any[]>([]);

    useEffect(() => {
        fetchFriendRequests();
    }, []);

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

    return (
        <div className="friend-request">
          <h1>Friend Requests</h1>
          { friendRequests.length > 0 ? (
            friendRequests.map((friendRequest) => (
            <div key={friendRequest.id}>
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
