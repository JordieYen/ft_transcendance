import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";
import Avatar from "../header_icon/Avatar";
import '../profile/profile.css';
import SearchBar from "../search_bar/SearchBar";
import FriendRequest from "./FriendRequest";
import FriendRequestNotification from "./FriendRequestNotification";

const FriendList = () => {
    const [userList, setUser] = useState<any[]>([]);
    const [filteredUserList, setFilteredUserList] = useState<any[]>([]);
    const [friendRequestSent, setFriendRequestSent] = useState(false);
    const [friendRequest, setFriendRequest] = useState<any>(null);

    let userData: any = {};
    if (typeof window !== "undefined") {
        const userDataString = localStorage?.getItem("userData");
        userData = userDataString ? JSON.parse(userDataString) : {};
    }


    React.useEffect(() => {
        fetchUserList();
    }, []);
    
    const fetchUserList = async () => {
        try {
            console.log('userData in friend', userData);
            
            const response = await fetch('http://localhost:3000/users', {
                credentials: 'include',
            });
            if (response.ok) {
                const userList = await response.json();
                setUser(userList);
                setFilteredUserList(userList);
                console.log('userList', userList);
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            console.log('Error fetching friend request:', error);
        }
    };

    const handleSearch = (searchQuery: string) => {
        if (searchQuery.trim() === "") {
            setFilteredUserList(userList);
        } else {
            const filteredList = userList.filter((user) => {
                return user.username.toLowerCase().includes(searchQuery.toLowerCase());
            });
            setFilteredUserList(filteredList);
        }
    };

    const sendFriendRequest = async (senderId: number, receiverId: number) => {
        try {
            const response = await fetch(`http://localhost:3000/friend/friend-request/${senderId}/${receiverId}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                const friendRequest = await response.json();
                console.log('friendRequest', friendRequest);
                setFriendRequestSent(true);
                setFriendRequest(friendRequest);
            } else {
                throw new Error('Failed to send friend request');
            }
        } catch (error) {
            console.log('Error fetching friend request:', error);
        }
    };

    return (
        <div className='friend-page'>
            <SearchBar onSearch={ handleSearch } onReset={ fetchUserList }/>
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
                    {filteredUserList.map(user => (
                        <tr key={ user?.id }>
                            <td>
                                <Avatar src={ user?.avatar } alt="user avatar" width={40} height={40}/>
                            </td>
                            <td> { user?.username }</td>
                            <td>
                            {friendRequestSent && friendRequest?.receiver.id === user.id ? (
                                    <button className="text-black">
                                    Cancel Friend Request
                                    </button>
                                ) : (
                                    <button className="bg-black" onClick={() => sendFriendRequest(userData.id, user.id)}>
                                    Add Friend
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='friend-page'>
                {/* {friendRequestSent && <FriendRequestNotification friendRequest={ friendRequest } />} */}
                {friendRequestSent && <FriendRequest userId={ userData.id } />}
            </div>
        </div>
    );
};

export default FriendList;
