import { SocketContext } from "@/app/socket/SocketProvider";
import useUserStore from "@/store/useUserStore";
import { use, useContext, useEffect, useState } from "react";
import Avatar from "../header_icon/Avatar";
import { toUserProfile } from "./handleClick";
import InviteFriendGame from "./InviteFriendGame";
import ViewFriendGame from "./ViewFriendGame";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserTimes, faBan } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-hot-toast";
import ConfirmationModel from "./ConfirmationModel";

interface FriendProps {
  userDataId: number;
  setFriendRequestArray: React.Dispatch<
    React.SetStateAction<
      {
        requestId: number;
        senderId: number;
        receiverId: number;
        status: string;
      }[]
    >
  >;
  setFriendRequestStatus: React.Dispatch<
    React.SetStateAction<{
      [key: number]: boolean;
    }>
  >;
}

const Friend = ({
  userDataId,
  setFriendRequestArray,
  setFriendRequestStatus,
}: FriendProps) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  const socket = useContext(SocketContext);
  useEffect(() => {
    if (userDataId) {
      socket?.on("friend", (friend: any) => {
        setFriends(() => {
          return [...friend];
        });
      });
      socket?.on("unfriend", (friendId: number) => {
        setFriends((prevFriends) =>
          prevFriends.filter((friend) => friend.id !== friendId),
        );
        setFriendRequestStatus((prevStatus) => {
          return {
            ...prevStatus,
            [friendId]: false,
            [userDataId]: false,
          };
        });
      });
      fetchFriends();
    }
  }, [socket, userDataId]);

  const fetchFriends = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_NEST_HOST}/friend/friends/${userDataId}`,
        {
          credentials: "include",
          mode: "cors",
        },
      );
      if (response.ok) {
        const friends = await response.json();
        setFriends(friends);
      } else {
        throw new Error("Failed to fetch friends");
      }
    } catch (error) {
      console.log("Error fetching friends:", error);
    }
  };

  const unfriend = async(friendId: number) => {
    try {
      await new Promise<void>((resolve) => {
        const closeModel = () => {
          resolve();
        }
        const confirmAction = () => {
          resolve();
          socket?.emit("unfriend", {
            userId: userDataId,
            friendId: friendId,
          });
          setFriends((prevFriends) =>
            prevFriends.filter((friend) => friend.id !== friendId)
          );
          setFriendRequestStatus((prevStatus) => ({
            ...prevStatus,
            [friendId]: false,
            [userDataId]: false,
          }));
        };
        toast(
          <ConfirmationModel
            message="Are you sure you want to unfriend this friend?"
            onConfirm={confirmAction}
            onCancel={closeModel}
            confirmMessage="Successfully unfriended!"
            closeMessage="Unfriending cancelled!"
          />
        );
      });
    } catch (error) {
      console.log("Error unfriending friend:", error);
    }
  };

  const block = async (friendId: number) => {
    try {
      await new Promise<void>((resolve) => {
        const closeModel = () => {
          resolve();
        }
        const confirmAction = () => {
          resolve();
          socket?.emit("block", {
            blockerId: userDataId,
            friendId: friendId,
          });
          setFriends((prevFriends) =>
            prevFriends.filter((friend) => friend.id !== friendId),
          );
          setFriendRequestStatus((prevStatus) => {
            return {
              ...prevStatus,
              [friendId]: false,
              [userDataId]: false,
            };
          });
        };
        toast(
          <ConfirmationModel
            message="Are you sure you want to block this friend?"
            onConfirm={confirmAction}
            onCancel={closeModel}
            confirmMessage="Successfully blocked!"
            closeMessage="Blocking cancelled!"
          />
        );
      });
    } catch (error) {
      console.log("Error blocking friend:", error);
    }
  }

  return (
    <div className="friend-list flex-col text-center">
      <h1 className="font-semibold text-2xl mb-4 text-myyellow">Friends</h1>
      {
        friends.length > 0 ? (
        friends.map((friend) => (
          <div className="flex items-center gap-10 p-10" key={friend?.id}>
            <div className="h-22 w-20">
              <Avatar
                src={friend?.avatar}
                alt="user avatar"
                width={50}
                height={50}
                onClick={() => toUserProfile(friend?.id)}
              />
            </div>
            <div className="flex-col gap-1 text-left">
              <p>{friend?.username}</p>
              <div className={`${friend?.online ? "Online" : "Offline"}`}>
                {friend?.online ? (
                  <div className="green-dot"></div>
                ) : (
                  <div className="red-dot"></div>
                )}
                <span>{friend?.online ? "Online" : "Offline"}</span>
              </div>
              {/* Display Game Status */}
              <div className="action flex flex-wrap md:flex-row gap-3 p-2">
                {
                  (friend?.roomId !== "null" && friend?.roomId !== null) ? (
                    <ViewFriendGame roomId={friend.roomId} />
                  ) : (
                    <InviteFriendGame friend={friend} user={userData} socket={socket}/>
                  )
                }
                <button onClick={() => unfriend(friend?.id)} className="transition-transform hover:scale-105 hover:bg-red-500 hover:text-white py-2 px-4 rounded-md"> <FontAwesomeIcon icon={faUserTimes} className="mr-2 "/>
                Unfriend</button>
                <button onClick={() => block(friend?.id)} className="transition-transform hover:scale-105 hover:bg-gray-700 hover:text-white py-2 px-4 rounded-md"><FontAwesomeIcon icon={faBan} className="mr-2" />Block</button>
              </div>
            </div>
          </div>
        ))
        ) : (
          <p className="text-gray-700 py-4">No friend</p>
          )
        }
    </div>
  );
};

export default Friend;
