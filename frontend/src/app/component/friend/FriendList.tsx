import './friend.css';
import React from "react";
import { useState, useEffect } from "react";
import Avatar from "../header_icon/Avatar";
import SearchBar from "../search_bar/SearchBar";
import FriendRequest from "./FriendRequest";
import { io, Socket }  from 'socket.io-client';
import Friend from "./Friend";

const FriendList = () => {
    const [usersList, setUserList] = useState<any[]>([]);
    const [filteredUsersList, setFilteredUsersList] = useState<any[]>([]);
    const [friendRequestArray, setFriendRequestArray] = useState<{ userId: number, requestId: number, status: string }[]>([]);
    const [friendRequest, setFriendRequest] = useState<any>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [friendRequestStatus, setFriendRequestStatus] = useState<{ [key: number]: boolean }>({});
    const [isSendRequestDisabled, setIsSendRequestDisabled] = useState<{[key: number]: boolean }>({});
    
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
                { userId: receivedFriendRequest?.receiver?.id, requestId: receivedFriendRequest.id, status: receivedFriendRequest.status }
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
        // console.log('saving state to local storage');
        localStorage.setItem("friendRequestStatus", JSON.stringify(friendRequestStatus));
        localStorage.setItem("friendRequestArray", JSON.stringify(friendRequestArray));
        // console.log('friendRequestArray', friendRequestArray);
        // console.log('friendRequestStatus', friendRequestStatus);
        

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

        // handle each both user send friend request to each other
        if (isFriended(userId)) {
            console.log('both send friend request to each other');
            return;
        }
        
        if (friendRequestStatus[userId]) {
            cancelFriendRequest(userId);
            return;
        }

        socket?.emit("friend-request-sent", {
            senderId: userData.id,
            receiverId: userId,
        });
        setFriendRequestStatus((prevStatus) => ({ ...prevStatus, [userId]: true }));
        console.log('send friendRequestStatus', friendRequestStatus);
        setIsSendRequestDisabled((prevStatus) => ({ ...prevStatus, [userId]: true }));
        console.log('send isSendRequestDisabled', isSendRequestDisabled);
        
        // socket?.on("friend-request-received", (friendRequest: any) => {
        //     setFriendRequest(friendRequest);
        //     setFriendRequestArray((prevArray) => [...prevArray, friendRequest.id]);
        // });
    }

    const isFriended = (userId: number) => {
        const friendRequest = friendRequestArray.find(
            (request) => request.userId === userId && request.status === "friended"
        );
        return friendRequest;
    };

    // return (
    //     <div className='friend-page'>
    //         <SearchBar onSearch={ handleSearch } onReset={ fetchUsersList }/>
    //         <h1 className="flex justify-center mb-10">Friend List</h1>
    //         <table>
    //             <thead>
    //                 <tr>
    //                     <th>Avatar</th>
    //                     <th>username</th>
    //                     <th>Status</th>
    //                     <th>action</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 { filteredUsersList.map(user => user.id !== userData.id && (
    //                     <tr key={ user?.id }>
    //                         <td>
    //                             <Avatar src={ user?.avatar } alt="user avatar" width={40} height={40}/>
    //                         </td>
    //                         <td> { user?.username }</td>
    //                         <td>
    //                             { user?.online ? 'online' : 'offline' }
    //                         </td>
    //                         <td>
    //                                 {/* { friendRequest?.receiver.id === user.id ? (
    //                                 // <button className="text-black" onClick={() => handleClick(user.id)}>
    //                                 <button className="text-black cancel-button" onClick={() => cancelFriendRequest(user.id)}>
    //                                 Cancel { friendRequest  && friendRequest?.receiver?.id }
    //                                 </button>
    //                             ) : (
    //                                 // <button className="bg-black" onClick={() => handleClick(user.id)}>
    //                                 <button className="bg-black add-button" onClick={() => sendFriendRequest(user.id)}>
    //                                 Add Friend
    //                                 </button>
    //                             )} */}
    //                             <button
    //                                 className={friendRequestStatus[user.id] ? "cancel-button" : "add-button"}
    //                                 onClick={() =>
    //                                     friendRequestStatus[user.id] && isFriended(user.id)
    //                                     ? cancelFriendRequest(user.id)
    //                                     : friendRequestStatus[user.id]
    //                                     ? cancelFriendRequest(user.id)
    //                                     : sendFriendRequest(user.id)
    //                                 }
    //                                 >
    //                                 { friendRequestStatus[user.id] && isFriended(user.id) 
    //                                     ? "unfriend"
    //                                     : friendRequestStatus[user.id]
    //                                     ? "Cancel" : "Add Friend"}
    //                                 { user.id }
    //                             </button>

    //                         </td>
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //         <div className='friend-page'>
    //             <FriendRequest 
    //             userId={ userData.id }
    //             currUser={ userData }
    //             socket={ socket }
    //             friendRequestArray={ friendRequestArray }
    //             friendRequestStatus={ friendRequestStatus }
    //             setFriendRequestStatus={ setFriendRequestStatus }
    //             />
    //         </div>
    //     </div>
    // );

    return (
        <div className='friend-page w-full flex'>
            <div className='friend-section w-1/3 bg-green-800'>
                <Friend userDataId={userData.id}/>

            </div>
            <div className='users-list w-2/3'>
                <div className='flex flex-col h-full'>
                    <div className='px-4 py-2'>
                        <SearchBar onSearch={handleSearch} onReset={fetchUsersList} />
                    </div>                
                    <div className="flex-2 overflow-y-auto px-4 py-2">

                        <h1 className="flex justify-center mb-10">Users List</h1>
                        <div className="card-container gap-4">
                            { filteredUsersList.map(user => user.id !== userData.id && (
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
                                                friendRequestStatus[user.id] && isFriended(user.id)
                                                ? cancelFriendRequest(user.id)
                                                : friendRequestStatus[user.id]
                                                ? cancelFriendRequest(user.id)
                                                : sendFriendRequest(user.id)
                                            }
                                            disabled={isSendRequestDisabled[user.id] === true}
                                            >
                                            { friendRequestStatus[user.id] && isFriended(user.id) 
                                                ? "unfriend"
                                                : friendRequestStatus[user.id]
                                                ? "Cancel " : "Add Friend "}
                                             { user.id }
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="friend-page bg-black">
                        <FriendRequest
                        userId={ userData.id }
                        currUser={ userData }
                        socket={ socket }
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
