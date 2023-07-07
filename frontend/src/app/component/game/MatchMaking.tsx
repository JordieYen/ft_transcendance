import { SocketContext } from "@/app/socket/SocketProvider";
import useUserStore from "@/hooks/useUserStore";
import { useContext, useEffect, useRef, useState } from "react";

const MatchMaking  = () => {
    const [isMatchmaking, setIsMatchmaking] = useState(false);
    const [userData, setUserData] = useUserStore((state) => [state.userData, state.setUserData]);
    const [roomId, setRoomId] = useState<any>(null);
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (socket && userData.id) {
            socket?.on('start-game', () => {
                console.log('game-start');
            });
        }
        return () => {
            socket?.off('start-game');
        }
    }, [socket, userData]);

    const handleMatchmaking = () => {
        setIsMatchmaking(true);
        socket?.emit('join-room', {
            userName: userData.username,
        });
    }

    const handleGameOver = () => {
        socket?.emit('game-over', {
            roomId: roomId,
        });
        setRoomId(null);
        setIsMatchmaking(false);
    }

    useEffect(() => {
        socket?.on('in-room', (roomId: number) => {
            setRoomId(roomId);
        });
        socket?.on('joined-room', (roomId: number) => {
            setRoomId(roomId);
        });
        console.log('roomId', roomId);
    }, [roomId]);


    return (
        <div className="flex gap-5">
        <button className="bg-mygrey" onClick={handleMatchmaking} disabled={isMatchmaking}>
            {isMatchmaking ? 'Matchmaking in progress' : 'Matchmaking'}
        </button>
        <button className="bg-mygrey" onClick={handleGameOver}>
            {'Game Over'}
        </button>
        </div>
    )
}

export default MatchMaking;
