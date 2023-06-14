import { use, useEffect, useState } from "react";
import Avatar from "../header_icon/Avatar";

const Friend = ( { userDataId }: { userDataId: number }) => {
    const [ friends, setFriends ] = useState<any[]>([]);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async() => {
        try {
            console.log('userDataId', userDataId);
            
            const response = await fetch(`http://localhost:3000/friend/friends/${userDataId}`, {
                credentials: 'include',
            });
            if (response.ok) {
                const friends = await response.json();
                console.log('friends', friends);
                setFriends(friends);
            } else {
                throw new Error('Failed to fetch friends');
            }
        } catch (error) {
            console.log('Error fetching friends:', error);
        }
    }

    return (
        <div className="friend flex-col">
            <h1>Friends</h1>
            {friends.map((friend) => {
                const isCurrentUserSender = userDataId === friend.sender.id;
                const avatarSrc = isCurrentUserSender ? friend.receiver.avatar : friend.sender.avatar;
                console.log('avatarSrc', avatarSrc);
                
                const friendUsername = isCurrentUserSender ? friend.receiver.username : friend.sender.username;
                return (
                    <div className='flex items-center gap-10 p-10' key={friend.id}>
                        <div className='h-22 w-20 overflow-hidden'>
                            <Avatar src={ avatarSrc } alt="user avatar" width={50} height={50}/>

                        </div>
                        <p>{friendUsername}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default Friend;

