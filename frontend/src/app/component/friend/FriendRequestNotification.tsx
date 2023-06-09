import { useEffect, useState } from "react";

interface FriendRequestNotificationProps {
    friendRequest: any; 
  }

const FriendRequestNotification = ( { friendRequest } : FriendRequestNotificationProps) => {
    // const [friendRequest, setFriendRequest] = useState(null);

    useEffect(() => {
        handleFriendRequestWebhook(friendRequest);
    }, [friendRequest]);
    
    const handleFriendRequestWebhook = async (body: any) => {
        //  const { event, data } = body;
        //  const { senderId, receiverId } = data;
        console.log('body', body);
        
        //  setFriendRequest(body);
    };

    return (
        <div>
            <p>Friend Request Notification</p>
            <p>Receiver: {friendRequest?.receiver.username}</p>
            <p>Sender: {friendRequest?.sender.username}</p>
            <p>{friendRequest?.status}</p>
        </div>
    )
};

export default FriendRequestNotification;

