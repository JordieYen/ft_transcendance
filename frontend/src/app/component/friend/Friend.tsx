import { SocketContext } from "@/app/socket/SocketProvider";
import { use, useContext, useEffect, useState } from "react";
import Avatar from "../header_icon/Avatar";

interface FriendProps {
    userDataId: number;
    setFriendRequestArray: React.Dispatch<React.SetStateAction<{
        requestId: number;
        senderId: number;
        receiverId: number;
        status: string;
    }[]>>;
    setFriendRequestStatus: React.Dispatch<React.SetStateAction<{
        [key: number]: boolean;
    }>>;
}

const Friend = ( { userDataId, setFriendRequestArray, setFriendRequestStatus }: FriendProps) => {
    const [ friends, setFriends ] = useState<any[]>([]);

    const socket = useContext(SocketContext);
    useEffect(() => {
        socket?.on('friend', (friend: any) => {
            setFriends(() => {
                return [ ...friend];
            });
        });
        socket?.on('unfriend', (friendId: number) => {
            console.log('unfriend', friendId);
            setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== friendId));
            setFriendRequestStatus((prevStatus) => {
                return {
                    ...prevStatus,
                    [friendId]: false,
                    [userDataId]: false,
                };
            });
        });
        fetchFriends();
    }, [socket]);

    useEffect(() => {
        console.log('friends',friends);
    }, [friends]);


    const fetchFriends = async() => {
        try {
            console.log('userDataId', userDataId);
            
            const response = await fetch(`http://localhost:3000/friend/friends/${userDataId}`, {
                credentials: 'include',
                mode: 'cors',
            });
            if (response.ok) {
                const friends = await response.json();
                setFriends(friends);
            } else {
                throw new Error('Failed to fetch friends');
            }
        } catch (error) {
            console.log('Error fetching friends:', error);
        }
    }

    const unfriend = async (friendId: number) => {
        try {
            const confirmation = window.confirm('Are you sure you want to unfriend this friend?');
            if (confirmation) {
                socket?.emit('unfriend', {
                    userId: userDataId,
                    friendId: friendId,
                });
                setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== friendId));
                setFriendRequestStatus((prevStatus) => {
                    return {
                        ...prevStatus,
                        [friendId]: false,
                        [userDataId]: false,
                    };
                });
            }
        } catch (error) {
            console.log('Error unfriending friend:', error);
        }
    }

    const block = async (friendId: number) => {
        try {
            const confirmation = window.confirm('Are you sure you want to block this friend?');
            if (confirmation) {
                socket?.emit('block', {
                    blockerId: userDataId,
                    friendId: friendId,
                });
                setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== friendId));
                setFriendRequestStatus((prevStatus) => {
                    return {
                        ...prevStatus,
                        [friendId]: false,
                        [userDataId]: false,
                    };
                });
            }
        } catch (error) {
            console.log('Error blocking friend:', error);
        }
    }


    return (
        <div className="friend flex-col">
            <h1>Friends</h1>
            { friends && friends
                .map((friend) => (
                <div className='flex items-center gap-10 p-10' key={friend?.id}>
                    <div className='h-22 w-20 overflow-hidden'>
                       <Avatar src={ friend?.avatar } alt="user avatar" width={50} height={50}/>
                    </div>
                    <div className='flex-col gap-1'>
                        <p>{friend?.username}</p>
                        <div className={`${friend?.online ? 'online' : 'offline'}`}>
                            { friend?.online ? <div className='green-dot'></div> : <div className='red-dot'></div>}
                            <span>{friend?.online ? 'online' : 'offline'}</span>

                        </div>
                        <div className='flex gap-2'>
                            <button onClick={ () => unfriend(friend?.id)}>Unfriend</button>
                            <button onClick={ () => block(friend?.id)}>Block</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Friend;

