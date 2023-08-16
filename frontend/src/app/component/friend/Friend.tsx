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

  // const unfriend = async (friendId: number) => {
  //   try {
  //     const confirmation = window.confirm(
  //       "Are you sure you want to unfriend this friend?",
  //     );
  //     if (confirmation) {
  //       socket?.emit("unfriend", {
  //         userId: userDataId,
  //         friendId: friendId,
  //       });
  //       setFriends((prevFriends) =>
  //         prevFriends.filter((friend) => friend.id !== friendId),
  //       );
  //       setFriendRequestStatus((prevStatus) => {
  //         return {
  //           ...prevStatus,
  //           [friendId]: false,
  //           [userDataId]: false,
  //         };
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Error unfriending friend:", error);
  //   }
  // };

  const unfriend = async (friendId: number) => {
    try {
      const confirmation = await toast.promise(
        new Promise<void>((resolve, reject) => {
          const userConfirmation = confirm(
            "Are you sure you want to unfriend this friend?",
          );
          if (userConfirmation) {
            socket?.emit("unfriend", {
              userId: userDataId,
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
            }
            );
            resolve();
          } else {
            reject();
          }
        }),
        {
          loading: "Unfriending...",
          success: "Unfriended!",
          error: "Cancel unfriending friend",
        },
      );
    } catch (error) {
      console.log("Error unfriending friend:", error);
    }
  };

  // const block = async (friendId: number) => {
  //   try {
  //     const confirmation = window.confirm(
  //       "Are you sure you want to block this friend?",
  //     );
  //     if (confirmation) {
  //       socket?.emit("block", {
  //         blockerId: userDataId,
  //         friendId: friendId,
  //       });
  //       setFriends((prevFriends) =>
  //         prevFriends.filter((friend) => friend.id !== friendId),
  //       );
  //       setFriendRequestStatus((prevStatus) => {
  //         return {
  //           ...prevStatus,
  //           [friendId]: false,
  //           [userDataId]: false,
  //         };
  //       });
  //     }
  //   } catch (error) {
  //     console.log("Error blocking friend:", error);
  //   }
  // };

  const block = async (friendId: number) => {
    try {
      const confirmation = await toast.promise(
        new Promise<void>((resolve, reject) => {
          const userConfirmation = confirm(
            "Are you sure you want to block this friend?",
          );
          if (userConfirmation) {
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
            resolve();
          } else {
            reject();
          }
        }),
        {
          loading: "Blocking...",
          success: "Blocked!",
          error: "Cancel blocking friend",
        },
      );
    } catch (error) {
      console.log("Error blocking friend:", error);
    }
  }

  return (
    <div className="friend-list flex-col">
      <h1>Friends</h1>
      {friends &&
        friends.map((friend) => (
          <div className="flex items-center gap-10 p-10" key={friend?.id}>
            <div className="h-22 w-20 overflow-hidden">
              <Avatar
                src={friend?.avatar}
                alt="user avatar"
                width={50}
                height={50}
                onClick={() => toUserProfile(friend?.id)}
              />
            </div>
            <div className="flex-col gap-1">
              <p>{friend?.username}</p>
              <div className={`${friend?.online ? "online" : "offline"}`}>
                {friend?.online ? (
                  <div className="green-dot"></div>
                ) : (
                  <div className="red-dot"></div>
                )}
                <span>{friend?.online ? "online" : "offline"}</span>
              </div>
              {/* Display Game Status */}
              <div className="flex gap-3 p-2">
                {
                  (friend?.roomId !== "null" && friend?.roomId !== null) ? (
                    <ViewFriendGame roomId={friend.roomId} />
                  ) : (
                    <InviteFriendGame friend={friend} user={userData} socket={socket}/>
                  )
                }
                <button onClick={() => unfriend(friend?.id)}> <FontAwesomeIcon icon={faUserTimes} />
                </button>
                <button onClick={() => block(friend?.id)}><FontAwesomeIcon icon={faBan} /></button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Friend;
