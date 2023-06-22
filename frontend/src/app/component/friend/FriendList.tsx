import './friend.css';
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import Avatar from "../header_icon/Avatar";
import SearchBar from "../search_bar/SearchBar";
import FriendRequest from "./FriendRequest";
import Friend from "./Friend";
import { SocketContext } from '@/app/socket/SocketProvider';
import Block from './Block';
import useSessionStorageState from '@/app/utils/useSessionStorageState';

const FriendList = () => {
    const [usersList, setUserList] = useState<any[]>([]);
    const [filteredUsersList, setFilteredUsersList] = useState<any[]>([]);
    const [friendRequestArray, setFriendRequestArray] = useSessionStorageState({
        name: 'friendRequestArray',
        initialValue: [] as {
            requestId: number,
            senderId: number,
            receiverId: number,
            status: string
        }[],
    })
    const [friendRequestStatus, setFriendRequestStatus] = useSessionStorageState({
        name: 'friendRequestStatus',
        initialValue: {} as { 
            [key: number]: boolean
        },
    })
    const socket = useContext(SocketContext);
    // const userData = UserData();
    let userData: any = {};
    if (typeof window !== "undefined") {
        const userDataString = sessionStorage?.getItem('userData');
        userData = userDataString ? JSON.parse(userDataString) : {};
    }

    useEffect(() => {
        socket?.emit('join', `${userData?.id}`);
        socket?.on("friend-request-received", (receivedFriendRequest: any) => {
            console.log('friend-request-received socket', receivedFriendRequest);
            setFriendRequestArray((prevArray: any) => {
                const existingRequest = prevArray.find(
                  (request: any) => request.requestId === receivedFriendRequest.id
                );
              
                if (existingRequest) {
                  const updatedArray = prevArray.map((request: any) => {
                    if (request.requestId === receivedFriendRequest.id) {
                      return {
                        ...request,
                        status: receivedFriendRequest.status,
                      };
                    }
                    return request;
                  });
                  return updatedArray;
                } else {
                  const newRequest = {
                    requestId: receivedFriendRequest.id,
                    senderId: receivedFriendRequest?.sender?.id,
                    receiverId: receivedFriendRequest?.receiver?.id,
                    status: receivedFriendRequest.status,
                  };
              
                  return [...prevArray, newRequest];
                }
            });
            if (receivedFriendRequest?.status === "decline") {
                setFriendRequestStatus((prevStatus: any) => ({
                    ...prevStatus,
                    [receivedFriendRequest?.receiver?.id]: false,
                }));
            }
            fetchUsersList();
        });
        fetchUsersList();
        // fetchFriendRequests();
        return () => {
            socket?.off('friend-request-sent');
            socket?.off('friend-request-received');
            socket?.off('friend-request-cancel');
        };
    }, [socket]);
    
    const fetchFriendRequests = async (userId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/friend/check-relationship/${userId}/${userData.id}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`);
            }
            console.log('response', response);
            if (response.ok) {
                const friendRequest = await response.json();
            }
            console.log('friendRequestStatus after fetch', friendRequestStatus);
        } catch (error) {
            console.log('Error fetching friend request:', error);
            return false;
        }
    };

    const fetchUsersList = async () => {
        try {
            const response = await fetch('http://localhost:3000/users', {
                credentials: 'include',
            });
            if (response.ok) {
                const usersList = await response.json();

                const filteredList = [];
                for (const user of usersList) {
                    const relationship = await checkFriendsOrBlocks(userData, user);
                    if (relationship === false) {
                        filteredList.push(user);
                    }
                }
                setUserList(filteredList);
                setFilteredUsersList(filteredList);
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

    const cancelFriendRequest =  (userId: number) => {
        const friendRequests = friendRequestArray.find((request: any) => request.receiverId === userId);
        console.log('friendRequests in cancel', friendRequests);
        
        socket?.emit("friend-request-cancel", {
            senderId: userData.id,
            receiverId: userId,
            // friendRequestId: friendRequest?.id
            friendRequestId: friendRequests?.requestId
        });
        setFriendRequestArray(friendRequestArray.filter((request: any) => request.receiverId !== userId));
        setFriendRequestStatus((prevStatus: any) => ({ ...prevStatus, [userId]: false }));
    };

    const sendFriendRequest = (userId: number) => {
        socket?.emit("friend-request-sent", {
            senderId: userData.id,
            receiverId: userId,
        });
        setFriendRequestStatus((prevStatus: any) => ({ ...prevStatus, [userId]: true }));
        // fetchFriendRequests(userId);
    }

    const isSent = (userId: number) => {
        const friendRequest = friendRequestArray.find(
            (request: any) => 
            request.receiverId === userData.id && 
            request.status === "pending" &&
            request.senderId === userId
        );
        return !!friendRequest;
    };

    // Function to check if two users are already friends
    const checkFriendsOrBlocks = async (user1: any, user2: any) => {
        try {
            const userId = user1.id;
            const friendId = user2.id;
            const response = await fetch(`http://localhost:3000/friend/check-relationship/${userId}/${friendId}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const responseData = await response.text();
                const friendship = responseData ? JSON.parse(responseData) : null;
                if (friendship === null) {
                    return false;
                }
                if (friendship.status === "friended" || friendship.status === "blocked") {
                    return true;
                }
                return false;
            }
        } catch (error) {
            console.log('Error fetching friend request:', error);
        }
    };

    return (
        <div className='friend-page w-full flex'>
            <div className='friend-section w-1/3 bg-green-800'>
                <div className="friend-request-page bg-red-600">
                        <FriendRequest
                        userId={ userData?.id }
                        currUser={ userData }
                        friendRequestArray={ friendRequestArray }
                        setFriendRequestArray={ setFriendRequestArray }
                        friendRequestStatus={ friendRequestStatus }
                        setFriendRequestStatus={ setFriendRequestStatus }
                        />
                </div>
                <div className='friend-page bg-green-800 flex'>
                    <Friend
                    userDataId={userData?.id}
                    setFriendRequestArray={setFriendRequestArray }
                    setFriendRequestStatus={setFriendRequestStatus }
                    />
                </div>
                <div className='block-page bg-slate-800'>
                    <Block />
                </div>

            </div>
            <div className='users-list w-2/3'>
                <div className='flex flex-col h-full'>
                    <div className='px-4'>
                        <SearchBar onSearch={handleSearch} onReset={fetchUsersList} />
                    </div>                
                    <div className="flex-2 overflow-y-auto px-4">
                        <h1 className="flex justify-center">Users List</h1>
                        <div className="card-container">
                            { filteredUsersList && filteredUsersList
                            // .filter(user => checkFriendsOrBlocks(userData, user) === false)
                            .map(user => user?.id !== userData?.id && (
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
                                            className={friendRequestStatus[user?.id] ? "cancel-button" : "add-button"}
                                            onClick={ () => 
                                                friendRequestStatus[user?.id]
                                                ? cancelFriendRequest(user?.id)
                                                : sendFriendRequest(user?.id)
                                            }
                                            
                                            disabled={ isSent(user?.id) === true }
                                            >
                                            { friendRequestStatus[user?.id]
                                                ? "Cancel"
                                                :  isSent(user?.id)
                                                ? "Friend Request Pending " 
                                                : "Add Friend "}
                                             { user?.id }
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default FriendList;
