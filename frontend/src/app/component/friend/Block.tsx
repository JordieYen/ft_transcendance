import { SocketContext } from "@/app/socket/SocketProvider";
import UserData from "@/app/webhook/UserContext";
import { setFips } from "crypto";
import { use, useContext, useEffect, useState } from "react";
import Avatar from "../header_icon/Avatar";

const Block = () => {
    const [ blocks, setBlocks ] = useState<any[]>([]);
    const [ blockerIdArray, setBlockerId ] = useState<number[]>([]);
    
    const socket = useContext(SocketContext);
    let userData: any = {};
    if (typeof window !== "undefined") {
        const userDataString = sessionStorage?.getItem('userData');
        userData = userDataString ? JSON.parse(userDataString) : {};
    }

    
    useEffect(() => {
        socket?.on('block', (block: any) => {
            const { user, BlockerId } = block;
            console.log('blockUser', user);
            console.log('blocked', BlockerId);
            setBlocks(user);
            // setBlockerId(BlockerId);
            setBlockerId((prevBlockerIds) => [...prevBlockerIds, BlockerId]);
            console.log('blockerIdArray', blockerIdArray);
            
            // setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== blockId));
        });
        socket?.on('unblock', (friendId: number) => {
            setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== friendId));
            setBlockerId((prevBlockerIds) => prevBlockerIds.filter((blockerId) => blockerId !== friendId));
        });
        fetchBlockUsers();

        return () => {
            socket?.off('block');
            socket?.off('unblock');
        }
    }, [socket]);

    useEffect(() => {
        console.log('blockerIdArray:', blockerIdArray);
    }, [blockerIdArray]);


    const fetchBlockUsers = async () => {
        try {
            const response = await fetch(`http://localhost:3000/friend/blocked/${userData?.id}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const blocks = await response.json();
                setBlocks(blocks);
                console.log('fetch block', blocks);
            
            } else {
                throw new Error('Failed to fetch blocks');
            }
        } catch (error) {
            console.log('Error fetching blocks:', error);
        }
    };

    const unBlock = async (blockId: number) => {
        try {
            const confirmation = confirm('Are you sure you want to unblock this user?');
            if (confirmation) {
                socket?.emit('unblock', {
                    unBlockerId: userData?.id,
                    blockId: blockId,
                });
                setBlocks((prevBlocks) => prevBlocks.filter((block) => block.id !== blockId));
                setBlockerId((prevBlockerIds) => prevBlockerIds.filter((blockerId) => blockerId !== blockId));
            }
        } catch (error) {
            console.log('Error unblocking:', error);
        }
    };
                

    return (
        <div>
            <h1>Block</h1>
            { blocks && blocks.map((block) => (
                <div className='flex items-center gap-10 p-10' key={block?.id}>
                <div className='h-22 w-20 overflow-hidden'>
                   <Avatar src={ block?.avatar } alt="user avatar" width={50} height={50}/>
                </div>
                <div className='flex-col gap-1'>
                    <p>{block?.username}</p>
                    <div className='flex gap-2'>
                    {
                        blockerIdArray
                        .includes(userData?.id) === true ?
                        <button onClick={ () => unBlock(block?.id)}>Unblock</button>
                        : 
                        <button disabled>Only blocker can unblock</button>
                    }
                    </div>
                </div>
            </div>
            ))}
        </div>
    )
};

export default Block;
