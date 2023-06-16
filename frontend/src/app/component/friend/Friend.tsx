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
            }
        } catch (error) {
            console.log('Error unfriending friend:', error);
        }
    }


    return (
        <div className="friend flex-col">
            <h1>Friends</h1>
            {friends.map((friend) => (
                <div className='flex items-center gap-10 p-10' key={friend?.id}>
                    <div className='h-22 w-20 overflow-hidden'>
                       <Avatar src={ friend?.avatar } alt="user avatar" width={50} height={50}/>
                    </div>
                    <div className='flex-col gap-1'>
                        <p>{friend?.username}</p>
                        <div className='flex gap-2'>
                            <button onClick={ () => unfriend(friend?.id)}>Unfriend</button>
                            <button>Block</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Friend;

