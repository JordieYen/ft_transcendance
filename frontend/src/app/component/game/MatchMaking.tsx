import { SocketContext } from "@/app/socket/SocketProvider";
import useUserStore from "@/hooks/useUserStore";
import { use, useContext, useEffect, useRef, useState } from "react";

const MatchMaking  = () => {
    const [isMatchmaking, setIsMatchmaking] = useState(false);
    const [userData, setUserData] = useUserStore((state) => [state.userData, state.setUserData]);
    const [roomId, setRoomId] = useState( () => {
        const storedRoomId = sessionStorage.getItem("roomId");
        return storedRoomId ? parseInt(storedRoomId) : null;
    })
    const socket = useContext(SocketContext);

    useEffect(() => {
        if (socket && userData.id) {
            socket?.on('start-game', () => {
                console.log('game-start');
            });
            socket?.on('opponent-disconnected', () => {
                setRoomId(null);
                setIsMatchmaking(false);
                console.log('opponent-disconnected');
                
            });
            socket?.on('room-closed', () => {
                console.log('room-closed');
            });
        }
        return () => {
            socket?.off('start-game');
            socket?.off('opponent-disconnected');
            socket?.off('room-closed');
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
            roomId: roomId || sessionStorage.getItem("roomId"),
            userName: userData.username,
        });
        setRoomId(null);
        setIsMatchmaking(false);
    }

    useEffect(() => {
        socket?.on('in-room', (roomId: number) => {
            setRoomId(roomId);
            sessionStorage.setItem("roomId", roomId.toString());
        });
        socket?.on('joined-room', (roomId: number) => {
            setRoomId(roomId);
            sessionStorage.setItem("roomId", roomId.toString());
        });
        console.log('roomId', roomId);
        return () => {
            socket?.off('in-room');
            socket?.off('joined-room');
        }
    }, [roomId, isMatchmaking]);

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
