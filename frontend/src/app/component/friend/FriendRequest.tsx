import UserData from "@/app/webhook/user_data";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import './friend.css';

interface FriendRequestProps {
  userId: number;
  currUser: any;
  socket: Socket | null;
  friendRequestArray: { userId: number; requestId: number }[];
  friendRequestStatus: { [key: number]: boolean };
  setFriendRequestStatus: React.Dispatch<React.SetStateAction<{ [key: number]: boolean }>>;
}

const FriendRequest = ( {userId, currUser, socket, friendRequestArray, friendRequestStatus, setFriendRequestStatus } : FriendRequestProps) => {
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const userData = UserData();

  useEffect(() => {

      // const socket = io('http://localhost:3000');
      socket?.on('friend-request', handleFriendRequestReceived);
      fetchFriendRequests();
      // socket?.on('friend-request-accepted', handleFriendRequestAccepted);
      return () => {
          socket?.off('friend-request', handleFriendRequestReceived);
          // socket?.disconnect();
      };
  }, [socket]);


  const fetchFriendRequests = async () => {
      try {
          const response = await fetch(`http://localhost:3000/friend/friend-requests/${userId}`, {
              credentials: 'include',
          });
          if (response.ok) {
              const friendRequests = await response.json() as any[];
              console.log('requests', friendRequests);
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
    //   console.log('handleFriendRequestReceived', friendRequest);
      const updatedRequest = [...friendRequest];
      return updatedRequest.sort((a, b) => a.id - b.id);
      // return updatedRequest;
    })    
  };

  const handleFriendRequestAccepted = (friendRequest: any) => {
    // setFriendRequests((prevFriendRequests) =>
    //   prevFriendRequests.map((friendRequest) => {
    //     if (friendRequest.id === friendRequest.id) {
    //       return { ...friendRequest, status: 'accepted' };
    //     }
    //     return friendRequest;
    //   })
    // );
  };

  // const handleFriendRequestReceived = (friendRequest: any) => {
  //       setFriendRequests([...friendRequest]);
        // setFriendRequests((prevFriendRequests) => [...prevFriendRequests, friendRequest]);
        // console.log('here friendRequest', friendRequest);
  // };

  // const acceptFriendRequest = async (friendRequest: number) => {
  //   try {
  //     const response = await fetch(`http://localhost:3000/friend/accept-friend-request/${friendRequest}`, {
  //       method: 'PUT',
  //       credentials: 'include',
  //     });
  //     if (response.ok) {
  //       setFriendRequests((prevFriendRequests) => 
  //       prevFriendRequests.map((friendRequest) => {
  //         if (friendRequest.id === friendRequest) {
  //           return { ...friendRequest, status: 'accepted' };
  //         }
  //         return friendRequest;
  //       })
  //       );
  //     } else {
  //       throw new Error('Failed to accept friend request');
  //     }
  //   } catch (error) {
  //     console.log('Error accepting friend request:', error);
  //   }
  // };

  const acceptFriendRequest = async (friendRequestId: number, accepterId: number) => {
    try {
      const confirmation = window.confirm('Are you sure you want to accept this friend request?');
      if (confirmation) {
        console.log('friendRequestId', userId, friendRequestId);
        socket?.emit('accept-friend-request', {
          userId: userId,
          friendRequestId: friendRequestId,
        });
        setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [accepterId]: true }));
        setFriendRequests((prevFriendRequests) => prevFriendRequests.filter((request) => request.id !== friendRequestId));
      }

    } catch (error) {
      console.log('Error accepting friend request:', error);
    }
  };

  const declineFriendRequest = async (friendRequestId: number, declinerId: number) => {
    try {
      console.log('declinerId', declinerId);
      
      const confirmation = window.confirm('Are you sure you want to decline this friend request?');
      if (confirmation) {
        socket?.emit('decline-friend-request', {
          userId: userId,
          friendRequestId: friendRequestId,
        });
        console.log('decline id', friendRequestId);
        setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [declinerId]: false }));
        console.log('friendRequestStatus', friendRequestStatus);
        console.log('friendRequestArray', friendRequestArray);
      }
    } catch (error) {
      console.log('Error declining friend request:', error);
    }
  };

  const unfriendFriendRequest = async (friendRequestId: number, unfrienderId: number) => {
    try {
      const confirmation = window.confirm('Are you sure you want to unfriend this friend?');
      if (confirmation) {
        socket?.emit('cancel-friend-request', {
          senderId: userId,
          friendRequestId: friendRequestId,
        });
        setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [unfrienderId]: false }));
        setFriendRequests((prevFriendRequests) => prevFriendRequests.filter((request) => request.id !== friendRequestId));
      }
    } catch (error) {
      console.log('Error unfriending friend:', error);
    }
  };
    
  return (
      <div className="friend-request flex-col">
        <h1>Friend Requests</h1>
        { friendRequests?.length > 0 ? (
          friendRequests
          // .filter((friendRequest) => friendRequest?.receiver?.id === userData?.id)
          // .filter((friendRequest) => friendRequest?.status !== 'friended')
          .map((friendRequest) => (
            <div key={friendRequest?.id}>
            <p>Id: {friendRequest?.id}</p>
            <p>Sender: {friendRequest?.sender?.username}</p>
            <p>Receiver: {friendRequest?.receiver?.username}</p>
            <p>Status: {friendRequest?.status}</p>
            <div className="flex gap-5 my-5">
              <button onClick={ () => acceptFriendRequest(friendRequest.id, friendRequest.receiver.id) }
              disabled={ friendRequest.status === 'friended'}
              className={friendRequest.status === 'friended' || friendRequest.status === 'decline' ? 'disabled-button' : ''}
              >Accept</button>
              <button onClick={ () => declineFriendRequest(friendRequest.id, friendRequest.receiver.id) }
              disabled={ friendRequest.status === 'decline'}
              className={friendRequest.status === 'decline' || friendRequest.status === 'friended'? 'disabled-button' : ''}
              >Decline</button>
              <button
              onClick={ () => unfriendFriendRequest(friendRequest.id, friendRequest.receiver.id) }
              disabled={ friendRequest.status !== 'friended'}
              className={friendRequest.status !== 'friended' ? 'disabled-button' : ''}
              >Unfriend</button>
            </div>
          </div>
        ))) : (
          <p>No friend requests sent</p>
        )}
      </div>
  );

  // return ( 
  //     <div className="friend-request flex-col">
  //       <h1>Friend Requests</h1>
  //       { userData?.receiveFriendRequest && userData?.receiveFriendRequest.length > 0 ? (
  //         userData?.receiveFriendRequest
  //           .filter((friendRequest: any) => friendRequest.status !== 'cancel')
  //           .map((friendRequest: any) => (
  //             <div key={friendRequest?.id}>
  //               <p>Id: {friendRequest?.id}</p>
  //               <p>Sender: {friendRequest?.sender?.username}</p>
  //               <p>Status: {friendRequest?.status}</p>
  //             </div>
  //         ))) :
  //         <p>No friend requests received</p>
  //       }
  //     </div>
  //   );

      {/* { currUser?.receiveFriendRequest && currUser?.receiveFriendRequest.length > 0 ? (
        currUser?.receiveFriendRequest
          .filter((friendRequest: any) => friendRequest.status !== 'cancel')
          .map((friendRequest: any) => (
            <div key={friendRequest?.id}>
              <p>Id: {friendRequest?.id}</p>
              <p>Sender: {friendRequest?.sender?.username}</p>
              <p>Status: {friendRequest?.status}</p>
            </div>
          ))
      ) : (
        <p>No friend requests received</p>
      )} */}
  
};

export default FriendRequest;
