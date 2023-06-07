import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";
import Avatar from "../header_icon/Avatar";
import '../profile/profile.css';
import SearchBar from "../search_bar/SearchBar";
import FriendRequest from "./FriendRequest";
import io from 'socket.io-client';


const FriendList = () => {
    const [usersList, setUser] = useState<any[]>([]);
    const [filteredUsersList, setFilteredUsersList] = useState<any[]>([]);
    // const [friendRequestSent, setFriendRequestSent] = useState(false);
    const [friendRequestsSent, setFriendRequestsSent] = useState<number[]>([]);
    const [friendRequest, setFriendRequest] = useState<any>(null);
    const socket = io('http://localhost:3000');

    let userData: any = {};
    if (typeof window !== "undefined") {
        const userDataString = localStorage?.getItem("userData");
        userData = userDataString ? JSON.parse(userDataString) : {};
    }

    React.useEffect(() => {
        // const socket = io("http://localhost:3000");
        
        fetchUsersList();
        // socket.on('friend-request-received', (friendRequest: any) => {
        //     console.log('friendRequest on socket', friendRequest);
        //     setFriendRequest(friendRequest);
        //     setFriendRequestsSent((prev) => [...prev, friendRequest.id]); 
        //     console.log('after emit XXXXXXX');
        // });

        return () => {
            socket.off('friend-request-sent');
        };
        // establishSocketConnection();
    }, []);
    
    // const establishSocketConnection = () => {
        // const socket = io('http://localhost:3000'); 
        // socket.on('friend-request-received', handleFriendRequestReceived)
        // return () => {
        //     socket.off('friend-request-received', handleFriendRequestReceived)
        //     socket.disconnect()
        // }
    // };

    // const handleFriendRequestReceived = (senderId: any) => {
    //     // Handle the friend request received event
    //     console.log('Friend request received from user:', senderId);
    // };
    
    const fetchUsersList = async () => {
        try {
            console.log('userData in friend', userData);
            const response = await fetch('http://localhost:3000/users', {
                credentials: 'include',
            });
            if (response.ok) {
                const usersList = await response.json();
                setUser(usersList);
                setFilteredUsersList(usersList);
                console.log('usersList', usersList);
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.log('Error fetching friend request:', error);
        }
    };

    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim() === "") {
            setFilteredUsersList(usersList);
        } else {
            const filteredList = usersList.filter((user) => {
                return user.username.toLowerCase().includes(searchQuery.toLowerCase());
            });
            setFilteredUsersList(filteredList);
        }
    };

    // const sendFriendRequest = async (senderId: number, receiverId: number) => {
    //     try {
    //         const response = await fetch(`http://localhost:3000/friend/friend-request/${senderId}/${receiverId}`, {
    //             method: 'POST',
    //             credentials: 'include',
    //         });
    //         if (response.ok) {
    //             const friendRequest = await response.json();
    //             console.log('friendRequest', friendRequest);
    //             setFriendRequestsSent([...friendRequestsSent, friendRequest.id]);
    //             setFriendRequest(friendRequest);
    //         } else {
    //             throw new Error('Failed to send friend request');
    //         }
    //     } catch (error) {
    //         console.log('Error fetching friend request:', error);
    //     }
    // };

    // const cancelFriendRequest = async (friendRequestId: number) => {
    //     try {
    //         const response = await fetch(`http://localhost:3000/friend/cancel-friend-request/${friendRequestId}`, {
    //             method: 'POST',
    //             credentials: 'include',
    //         });
    //         if (response.ok) {
    //             setFriendRequestsSent(friendRequestsSent.filter((id) => id !== friendRequestId));
    //             setFriendRequest(null);
    //         } else {
    //             throw new Error('Failed to cancel friend request');
    //         }
    //     } catch (error) {
    //         console.log('Error fetching friend request:', error);
    //     }
    // };

    // const handleClick = (friendRequestId: number, userId: number) => {
    //     if (friendRequestsSent.includes(friendRequestId)) {
    //         cancelFriendRequest(friendRequest.id);
    //     } else {
    //         sendFriendRequest(userData.id, userId);
    //         establishSocketConnection();
    //     }
    // };

    const handleClick = (userId: number) => {

        // const socket = io('http://localhost:3000');
        console.log('friendRequestsSent', friendRequestsSent);
        console.log('friendRequest', friendRequest);
        console.log('friendRequest.id', friendRequest?.id);
        // (friendRequestsSent.includes(friendRequest?.id) )? 'yes' : 'no';
        if (friendRequestsSent.includes(friendRequest?.id)) {
            socket.emit("cancel-friend-request", { senderId: userData.id, friendRequestId: friendRequest.id});
            setFriendRequestsSent(friendRequestsSent.filter((id) => id !== friendRequest.id));
            setFriendRequest(null);
        } else {
            console.log('enter here XXXXXXX');
            socket.emit("friend-request-sent", { senderId: userData.id, receiverId: userId});
        
            socket.on('friend-request-received', (friendRequest: any) => {
                console.log('friendRequest on socket', friendRequest);
                console.log('friendRequest on socket id', friendRequest.id);
                setFriendRequest(friendRequest);
                setFriendRequestsSent((prev) => [...prev, friendRequest.id]);
            });
            console.log('friendRequest on socket', friendRequest);
        }
    };


    return (
        <div className='friend-page'>
            <SearchBar onSearch={ handleSearch } onReset={ fetchUsersList }/>
            <h1 className="flex justify-center mb-10">Friend List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Avatar</th>
                        <th>username</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody>
                    { filteredUsersList.map(user => user.id !== userData.id && (
                        <tr key={ user?.id }>
                            <td>
                                <Avatar src={ user?.avatar } alt="user avatar" width={40} height={40}/>
                            </td>
                            <td> { user?.username }</td>
                            <td>
                                {/* {   friendRequestsSent && friendRequest?.receiver?.id === user.id ? ( */}
                                {   friendRequestsSent && friendRequest?.receiver?.id === user.id ? (
                                    <button className="text-black" onClick={() => handleClick(user.id)}>
                                    Cancel Friend Request
                                    </button>
                                ) : (
                                    <button className="bg-black" onClick={() => handleClick(user.id)}>
                                    Add Friend
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='friend-page'>
                {/* {friendRequestsSent && <FriendRequestNotification friendRequest={ friendRequest } />} */}
                <FriendRequest userId={ userData.id }/>
            </div>
        </div>
    );
};

export default FriendList;
