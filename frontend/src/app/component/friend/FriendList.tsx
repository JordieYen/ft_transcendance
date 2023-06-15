import './friend.css';
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Avatar from "../header_icon/Avatar";
import SearchBar from "../search_bar/SearchBar";
import FriendRequest from "./FriendRequest";
import Friend from "./Friend";
import { SocketContext } from '@/app/socket/SocketProvider';
import UserData, { UserContext } from '@/app/webhook/UserContext';

const FriendList = () => {
    const [usersList, setUserList] = useState<any[]>([]);
    const [filteredUsersList, setFilteredUsersList] = useState<any[]>([]);
    const [friendRequestArray, setFriendRequestArray] = useState<{ 
        requestId: number, 
        senderId: number, 
        receiverId: number, 
        status: string 
    }[]>([]);
    const [friendRequest, setFriendRequest] = useState<any>(null);
    const [friendRequestStatus, setFriendRequestStatus] = useState<{ [key: number]: boolean }>({});
    
    // const userData = useContext(UserContext);
    // const userData = UserData();
    let userData: any = {};
    if (typeof window !== "undefined") {
        const userDataString = localStorage?.getItem("userData");
        userData = userDataString ? JSON.parse(userDataString) : {};
    }
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket?.on("friend-request-received", (receivedFriendRequest: any) => {
            console.log('receivedFriendRequest socket', receivedFriendRequest);
            setFriendRequest(receivedFriendRequest);
            setFriendRequestArray((prevArray) => [
                ...prevArray,
                { 
                    requestId: receivedFriendRequest.id, 
                    senderId: receivedFriendRequest?.sender?.id,
                    receiverId: receivedFriendRequest?.receiver?.id, 
                    status: receivedFriendRequest.status }
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
            socket?.off('friend-request-sent');
            socket?.off('friend-request-received');
        };
    }, []);

    useEffect(() => {
        // console.log('saving state to local storage');
        localStorage.setItem("friendRequestStatus", JSON.stringify(friendRequestStatus));
        localStorage.setItem("friendRequestArray", JSON.stringify(friendRequestArray));
        console.log('friendRequestArray', friendRequestArray);
        // console.log('friendRequestStatus', friendRequestStatus);
        

    }, [friendRequestStatus, friendRequestArray]);
      
    const fetchUsersList = async () => {
        try {
            const response = await fetch('http://localhost:3000/users', {
                credentials: 'include',
            });
            if (response.ok) {
                const usersList = await response.json();
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
        
        const friendRequests = friendRequestArray.find((request) => request.receiverId === userId);
        console.log('friendRequests in cancel', friendRequests);
        socket?.emit("cancel-friend-request", {
            senderId: userData.id,
            // friendRequestId: friendRequest?.id
            friendRequestId: friendRequests?.requestId
        });
        setFriendRequestArray(friendRequestArray.filter((request) => request.receiverId !== userId));
        setFriendRequest(null);
        setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [userId]: false }));
        console.log('cancel friendRequestStatus', friendRequestStatus);

    };

    const sendFriendRequest = (userId: number) => {

        // handle each both user send friend request to each other
        if (isSent(userId)) {
            console.log('both send friend request to each other');
            return;
        }
        socket?.emit("friend-request-sent", {
            senderId: userData.id,
            receiverId: userId,
        });
        setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [userId]: true }));
        console.log('send friendRequestStatus', friendRequestStatus);
        // socket?.on("friend-request-received", (friendRequest: any) => {
        //     setFriendRequest(friendRequest);
        //     setFriendRequestArray((prevArray) => [...prevArray, friendRequest.id]);
        // });
    }

    const isSent = (userId: number) => {
        const friendRequest = friendRequestArray.find(
            (request) => 
            request.receiverId === userData.id && 
            request.status === "pending" &&
            request.senderId === userId
        );
        console.log('isSent friendRequest', friendRequest);
        
        return !!friendRequest;
    };

    // Function to check if two users are already friends
    const areFriends = (user1: any, user2: any) => {
        const friendship = friendRequestArray.find(
            (request) => 
            ((request.senderId === user1.id && request.receiverId === user2.id) ||
            (request.senderId === user2.id && request.receiverId === user1.id)) &&
            request.status === "friended"

        );
        return !!friendship;
    };

    // Filter out users who are already friends with the current user
    const filteredUsers = filteredUsersList.filter(user => !areFriends(userData, user));

    return (
        <div className='friend-page w-full flex'>
            <div className='friend-section w-1/3 bg-green-800'>
                <Friend userDataId={userData?.id}/>

            </div>
            <div className='users-list w-2/3'>
                <div className='flex flex-col h-full'>
                    <div className='px-4 py-2'>
                        <SearchBar onSearch={handleSearch} onReset={fetchUsersList} />
                    </div>                
                    <div className="flex-2 overflow-y-auto px-4 py-2">

                        <h1 className="flex justify-center mb-10">Users List</h1>
                        <div className="card-container gap-4">
                            {/* { filteredUsersList */}
                            { filteredUsers
                            .map(user => user.id !== userData?.id && (
                                <div className="card" key={user?.id}>
                                    <div className="card-avatar">
                                        <Avatar src={ user?.avatar } alt="user avatar" width={100} height={125}/>
                                    </div>
                                    <div className="card-details">
                                        <p className="card-username">{user?.username}</p>
                                        <div className={`card-status ${user?.online ? 'online' : 'offline'}`}>
                                            {user?.online ? <div className='green-dot'></div> : <div className='red-dot'></div>}
                                            <span className="card-status">{ user?.online ? 'online' : 'offline' }</span>
                                        </div>
                                    </div>
                                    <div className="card-actions">
                                        <button
                                            className={friendRequestStatus[user.id] ? "cancel-button" : "add-button"}
                                            onClick={() =>
                                                friendRequestStatus[user.id]
                                                ? cancelFriendRequest(user.id)
                                                : sendFriendRequest(user.id)
                                            }
                                            disabled={ isSent(user.id) === true }
                                            >
                                            { friendRequestStatus[user.id]
                                                ? "Cancel"
                                                : isSent(user.id)
                                                ? "Friend Request Pending " 
                                                : "Add Friend "}
                                             { user.id }
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="friend-page bg-black" style={ {backgroundColor: "red"}}>
                        <FriendRequest
                        userId={ userData?.id }
                        currUser={ userData }
                        friendRequestArray={ friendRequestArray }
                        friendRequestStatus={ friendRequestStatus }
                        setFriendRequestStatus={ setFriendRequestStatus }
                        />
                    </div>
                </div>
            </div>

        </div>

    );
};

export default FriendList;
