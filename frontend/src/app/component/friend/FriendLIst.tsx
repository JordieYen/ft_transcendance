import React from "react";
import { useState, useEffect } from "react";
import Avatar from "../header_icon/Avatar";
import './friend.css';
import SearchBar from "../search_bar/SearchBar";
import FriendRequest from "./FriendRequest";
import { io, Socket }  from 'socket.io-client';
import redis from "redis";



const FriendList = () => {
    const [usersList, setUserList] = useState<any[]>([]);
    const [filteredUsersList, setFilteredUsersList] = useState<any[]>([]);
    // const [friendRequestArray, setFriendRequestArray] = useState<number[]>([]);
    const [friendRequestArray, setFriendRequestArray] = useState<{ userId: number, requestId: number }[]>([]);
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
        newSocket.on("friend-request-received", (receivedFriendRequest: any) => {
            console.log('receivedFriendRequest socket', receivedFriendRequest);
            setFriendRequest(receivedFriendRequest);
            setFriendRequestArray((prevArray) => [
                ...prevArray,
                { userId: receivedFriendRequest?.receiver?.id, requestId: receivedFriendRequest.id }
            ]);
        });
        const storedStatus = localStorage.getItem("friendRequestStatus");
        if (storedStatus) {
            console.log('storedStatus', storedStatus);
            setFriendRequestStatus(JSON.parse(storedStatus));
        }
        const storedFriendRequests = localStorage.getItem("friendRequestArray");
        if (storedFriendRequests) {
          setFriendRequestArray(JSON.parse(storedFriendRequests));
        }
        fetchUsersList();
        return () => {
            // newSocket.off('friend-request-sent');
            // newSocket.off('friend-request-received');
            // newSocket.disconnect(); 
        };
    }, []);

    useEffect(() => {
        console.log('saving state to local storage');
        localStorage.setItem("friendRequestStatus", JSON.stringify(friendRequestStatus));
        localStorage.setItem("friendRequestArray", JSON.stringify(friendRequestArray));

    }, [friendRequestStatus, friendRequestArray]);

    // useEffect(() => {
    //     const storedFriendRequests = localStorage.getItem("friendRequestArray");
    //     if (storedFriendRequests) {
    //       setFriendRequestArray(JSON.parse(storedFriendRequests));
    //     }
    // }, []);

    // useEffect(() => {
    //     localStorage.setItem("friendRequestArray", JSON.stringify(friendRequestArray));
    // }, [friendRequestArray]);
      
    const fetchUsersList = async () => {
        try {
            const response = await fetch('http://localhost:3000/users', {
                credentials: 'include',
            });
            if (response.ok) {
                const usersList = await response.json();
                // const statusMap: { [key: number]: boolean } = {};
                // setFriendRequestStatus(statusMap);
                // const storedStatus = localStorage.getItem("friendRequestStatus");
                // if (storedStatus) {
                //   setFriendRequestStatus(JSON.parse(storedStatus));
                // } else {
                //   const statusMap: { [key: number]: boolean } = {};
                //   setFriendRequestStatus(statusMap);
                // }
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
        console.log('friend array', friendRequestArray);
        
        const friendRequests = friendRequestArray.find((request) => request.userId === userId);
        console.log('friendRequests in cancel', friendRequests);
        socket?.emit("cancel-friend-request", {
            senderId: userData.id,
            // friendRequestId: friendRequest?.id
            friendRequestId: friendRequests?.requestId
        });
        // setFriendRequestArray(friendRequestArray.filter((id) => id !== friendRequest?.id));
        setFriendRequestArray(friendRequestArray.filter((request) => request.userId !== userId));
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
        // socket?.on("friend-request-received", (friendRequest: any) => {
        //     setFriendRequest(friendRequest);
        //     setFriendRequestArray((prevArray) => [...prevArray, friendRequest.id]);
        // });

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
                                    { user.id }
                                </button>

                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='friend-page'>
                {/* {friendRequestArray && <FriendRequestNotification friendRequest={ friendRequest } />} */}
                <FriendRequest 
                userId={ userData.id }
                socket={ socket }
                friendRequestArray={ friendRequestArray }
                friendRequestStatus={ friendRequestStatus }
                setFriendRequestStatus={ setFriendRequestStatus }
                />
            </div>
        </div>
    );
};

export default FriendList;
