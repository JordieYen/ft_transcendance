import { SocketContext } from "@/app/socket/SocketProvider";
import UserData from "@/hooks/userData";
import { useContext, useEffect, useState } from "react";
import './friend.css';

interface FriendRequestProps {
  userId: number;
  currUser: any;
  friendRequestArray: { requestId: number, senderId: number, receiverId: number, status: string }[];
  setFriendRequestArray: React.Dispatch<React.SetStateAction<{ requestId: number; senderId: number; receiverId: number; status: string; }[]>>;
  friendRequestStatus: { [key: number]: boolean };
  setFriendRequestStatus: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
}

const FriendRequest = ( {userId, currUser, friendRequestArray, setFriendRequestArray, friendRequestStatus, setFriendRequestStatus } : FriendRequestProps) => {

  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  // const userData = UserData();
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (userId) {
      socket?.emit('join', `${userId}`);
      socket?.on('friend-request', handleFriendRequestReceived);
      const storedStatus = localStorage.getItem("friendRequestStatus");
      if (storedStatus) {
          setFriendRequestStatus(JSON.parse(storedStatus));
      }
      const storedFriendRequests = localStorage.getItem("friendRequestArray");
      if (storedFriendRequests) {
        setFriendRequestArray(JSON.parse(storedFriendRequests));
      }
      fetchFriendRequests();
    }
    return () => {
      socket?.emit('leave-room');
      socket?.off('friend-request', handleFriendRequestReceived);
    };
  }, [socket, userId]);


  useEffect(() => {
    sessionStorage.setItem("friendRequestStatus", JSON.stringify(friendRequestStatus));
    sessionStorage.setItem("friendRequestArray", JSON.stringify(friendRequestArray));
}, [friendRequestArray, friendRequestStatus]);


  const fetchFriendRequests = async () => {
      try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_HOST}/friend/friend-requests/${userId}`, {
              credentials: 'include',
          });
          if (response.ok) {
              const friendRequests = await response.json() as any[];
              setFriendRequests(friendRequests);
          } else {
              throw new Error('Failed to fetch friend requests');
          }
      } catch (error) {
          console.log('Error fetching friend requests:', error);
      }
  };

  const handleFriendRequestReceived = (friendRequest: any) => {
    setFriendRequests(() => {
      console.log('friendRequest XXXXX', friendRequest);
      const updatedRequest = [...friendRequest];
      return updatedRequest.sort((a, b) => a.id - b.id);
      // return updatedRequest;
    })    
  };

  const acceptFriendRequest = async (friendRequestId: number, senderId: number, accepterId: number) => {
    try {
      const confirmation = window.confirm('Are you sure you want to accept this friend request?');
      if (confirmation) {
        socket?.emit('accept-friend-request', {
          userId: userId,
          friendRequestId: friendRequestId,
          senderId: senderId,

        });
        setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [accepterId]: false }));
        setFriendRequests((prevFriendRequests) => prevFriendRequests.filter((request) => request.id !== friendRequestId));
      }

    } catch (error) {
      console.log('Error accepting friend request:', error);
    }
  };

  const declineFriendRequest = async (friendRequestId: number, declinerId: number) => {
    try {
      const confirmation = window.confirm('Are you sure you want to decline this friend request?');
      if (confirmation) {
        socket?.emit('decline-friend-request', {
          userId: userId,
          friendRequestId: friendRequestId,
        });
        setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [declinerId]: false }));
        setFriendRequests((prevFriendRequests) => prevFriendRequests.filter((request) => request.id !== friendRequestId));
      }
    } catch (error) {
      console.log('Error declining friend request:', error);
    }
  };

  return (
      <div className="friend-request flex-col">
        <h1>Friend Requests</h1>
        { friendRequests?.length > 0 ? (
          friendRequests
          // .filter((friendRequest) => friendRequest?.receiver?.id === userData?.id)
          .filter((friendRequest) => friendRequest?.status !== 'friended')
          .map((friendRequest) => (
            <div key={friendRequest?.id}>
            <p>Id: {friendRequest?.id}</p>
            <p>Sender: {friendRequest?.sender?.username}</p>
            <p>Receiver: {friendRequest?.receiver?.username}</p>
            <p>Status: {friendRequest?.status}</p>
            <div className="flex gap-5 my-5">
              <button onClick={ () => acceptFriendRequest(friendRequest.id, friendRequest.sender.id, friendRequest.receiver.id) }
              disabled={ friendRequest.status === 'friended'}
              className={friendRequest.status === 'friended' || friendRequest.status === 'decline' ? 'disabled-button' : ''}
              >Accept</button>
              <button onClick={ () => declineFriendRequest(friendRequest.id, friendRequest.receiver.id) }
              disabled={ friendRequest.status === 'decline'}
              className={friendRequest.status === 'decline' || friendRequest.status === 'friended'? 'disabled-button' : ''}
              >Decline</button>
            </div>
          </div>
        ))) : (
          <p>No friend requests received</p>
        )}
      </div>
  );
};

export default FriendRequest;
