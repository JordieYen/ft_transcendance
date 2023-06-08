import React from "react";
import { useState, useEffect } from "react";
import Avatar from "../header_icon/Avatar";
import '../profile/profile.css';
import SearchBar from "../search_bar/SearchBar";
import FriendRequest from "./FriendRequest";
import { io, Socket }  from 'socket.io-client';


const FriendList = () => {
    const [usersList, setUserList] = useState<any[]>([]);
    const [filteredUsersList, setFilteredUsersList] = useState<any[]>([]);
    const [friendRequestArray, setFriendRequestArray] = useState<number[]>([]);
    const [friendRequest, setFriendRequest] = useState<any>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [friendRequestStatus, setFriendRequestStatus] = useState<{ [key: number]: boolean }>({});
    
    let userData: any = {};
    if (typeof window !== "undefined") {
        const userDataString = localStorage?.getItem("userData");
        userData = userDataString ? JSON.parse(userDataString) : {};
    }

    useEffect(() => {
        const newSocket = io("http://localhost:3000");
        setSocket(newSocket);
        fetchUsersList();
        newSocket.on("friend-request-received", (friendRequest: any) => {
            setFriendRequest(friendRequest);
            setFriendRequestArray((prevArray) => [...prevArray, friendRequest.id]);
        });
        console.log('friendRequest', friendRequest);
        console.log('friendRequestArray', friendRequestArray);
        
        return () => {
            newSocket.off('friend-request-sent');
            newSocket.off('friend-request-received');
            newSocket.disconnect(); 
        };
    }, []);

    const fetchUsersList = async () => {
        try {
            const response = await fetch('http://localhost:3000/users', {
                credentials: 'include',
            });
            if (response.ok) {
                const usersList = await response.json();
                const statusMap: { [key: number]: boolean } = {};
                setFriendRequestStatus(statusMap);
                setUserList(usersList);
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

    const cancelFriendRequest = (userId: number) => {
        socket?.emit("cancel-friend-request", {
            senderId: userData.id,
            friendRequestId: friendRequest?.id
        });
        setFriendRequestArray(friendRequestArray.filter((id) => id !== friendRequest?.id));
        setFriendRequest(null);
        setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [userId]: false }));
        console.log('cancel friendRequestStatus', friendRequestStatus);

    };

    const sendFriendRequest = (userId: number) => {
        socket?.emit("friend-request-sent", {
            senderId: userData.id,
            receiverId: userId
        });
        setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [userId]: true }));
        console.log('send friendRequestStatus', friendRequestStatus);

    }

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
                                    {/* { friendRequest?.receiver.id === user.id ? (
                                    // <button className="text-black" onClick={() => handleClick(user.id)}>
                                    <button className="text-black cancel-button" onClick={() => cancelFriendRequest(user.id)}>
                                    Cancel { friendRequest  && friendRequest?.receiver?.id }
                                    </button>
                                ) : (
                                    // <button className="bg-black" onClick={() => handleClick(user.id)}>
                                    <button className="bg-black add-button" onClick={() => sendFriendRequest(user.id)}>
                                    Add Friend
                                    </button>
                                )} */}
                                <button
                                    className={friendRequestStatus[user.id] ? "cancel-button" : "add-button"}
                                    onClick={() =>
                                        friendRequestStatus[user.id]
                                        ? cancelFriendRequest(user.id)
                                        : sendFriendRequest(user.id)
                                    }
                                    >
                                    {friendRequestStatus[user.id] ? "Cancel" : "Add Friend"}
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='friend-page'>
                {/* {friendRequestArray && <FriendRequestNotification friendRequest={ friendRequest } />} */}
                <FriendRequest userId={ userData.id }/>
            </div>
        </div>
    );
};

export default FriendList;
