import { SocketContext } from "@/app/socket/SocketProvider";
import UserData from "@/app/webhook/UserContext";
import { setFips } from "crypto";
import { use, useContext, useEffect, useState } from "react";
import Avatar from "../header_icon/Avatar";
import useUserStore from "@/store/useUserStore";

const Block = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  // const [ blockerIdArray, setBlockerId ] = useState<number[]>([]);

  const socket = useContext(SocketContext);
  // let userData: any = {};
  // if (typeof window !== "undefined") {
  //   const userDataString = sessionStorage?.getItem("userData");
  //   userData = userDataString ? JSON.parse(userDataString) : {};
  // }
  const [userData, setUserData] = useUserStore((state) => [
    state.userData,
    state.setUserData,
  ]);

  useEffect(() => {
    if (userData) {
      socket?.on("block", (block: any) => {
        console.log("block", block.blockList);
        setBlocks(block.blockList);
      });
      socket?.on("unblock", (friendId: number) => {
        setBlocks((prevBlocks) =>
          prevBlocks.filter((block) => block.receiver.id !== friendId),
        );
      });
      fetchBlockUsers();
    }

    return () => {
      socket?.off("block");
      socket?.off("unblock");
    };
  }, [socket]);

  // useEffect(() => {
  //     console.log('blockerIdArray:', blockerIdArray);
  // }, [blockerIdArray]);

  const fetchBlockUsers = async () => {
    if (userData.id) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_NEST_HOST}/friend/blocked/${userData?.id}`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (response.ok) {
          const blocks = await response.json();
          console.log("fetch block", blocks);
          console.log("block.list", blocks.blockList);
          console.log("blocked.list", blocks.blockedList);
          setBlocks(blocks.blockList);
        } else {
          throw new Error("Failed to fetch blocks");
        }
      } catch (error) {
        console.log("Error fetching blocks:", error);
      }
    }
  };

  const unBlock = async (blockId: number) => {
    try {
      const confirmation = confirm(
        "Are you sure you want to unblock this user?",
      );
      if (confirmation) {
        socket?.emit("unblock", {
          unBlockerId: userData?.id,
          blockId: blockId,
        });
        setBlocks((prevBlocks) =>
          prevBlocks.filter((block) => block.id !== blockId),
        );
        // setBlockerId((prevBlockerIds) => prevBlockerIds.filter((blockerId) => blockerId !== blockId));
      }
    } catch (error) {
      console.log("Error unblocking:", error);
    }
  };

  return (
    <div>
      <h1>Block</h1>
      {blocks &&
        blocks.map((block) => (
          <div className="flex items-center gap-10 p-10" key={block?.id}>
            <div className="h-22 w-20 overflow-hidden">
              <Avatar
                src={block?.receiver?.avatar}
                alt="user avatar"
                width={50}
                height={50}
              />
            </div>
            <div className="flex-col gap-1">
              <p>{block?.receiver?.username}</p>
              <div className="flex gap-2">
                <button onClick={() => unBlock(block?.receiver?.id)}>
                  Unblock
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Block;
