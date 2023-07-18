import { SocketContext } from "@/app/socket/SocketProvider";
import useUserStore, { UserData } from "@/hooks/useUserStore";
import { use, useContext, useEffect, useState } from "react";
import Avatar from "../header_icon/Avatar";
import Image from "next/image";
import { useRouter } from "next/router";
import { useGameData } from "./GameContext";

const MatchMaking  = () => {
    const [isMatchmaking, setIsMatchmaking] = useState(false);
    const [userData, setUserData] = useUserStore((state) => [state.userData, state.setUserData]);
    const [roomId, setRoomId] = useState( () => {
        const storedRoomId = sessionStorage.getItem("roomId");
        return storedRoomId ? storedRoomId : null;
    })
    const socket = useContext(SocketContext);
    const [player1User, setPlayer1User] = useState<UserData | null>(null);
    const [player2User, setPlayer2User] = useState<UserData | null>(null);
    const router = useRouter();
    const { setGameState } = useGameData();

    useEffect(() => {
        if (socket && userData.id) {
            socket?.on('loading-screen', ({ roomId, players }: any) => {
                console.log('loading-screen');
                console.log('loading-screen', roomId, players);

                setPlayer1User(players[0].player);
                setPlayer2User(players[1].player);

            });
            socket?.on('opponent-disconnected', () => {
                setRoomId(null);
                setIsMatchmaking(false);
                setPlayer1User(null);
                setPlayer2User(null);
                console.log('opponent-disconnected');
                
            });
            socket?.on('room-closed', () => {
                console.log('room-closed');
            });
        }
        return () => {
            socket?.off('loading-screen');
            socket?.off('opponent-disconnected');
            socket?.off('room-closed');
        }
    }, [socket, userData]);

    const handleMatchmaking = () => {
        setIsMatchmaking(true);
        socket?.emit('join-room', {
            user: userData,
        });
    }

    const handleGameOver = () => {
        socket?.emit('game-over', {
            roomId: roomId || sessionStorage.getItem("roomId"),
            // userName: userData.username,
            user: userData,
        });
        setRoomId(null);
        setIsMatchmaking(false);
        setPlayer1User(null);
        setPlayer2User(null);
    }

    useEffect(() => {
        socket?.on('in-room', (roomId: string) => {
            setRoomId(roomId);
            sessionStorage.setItem("roomId", roomId);
        });
        socket?.on('joined-room', (roomId: string) => {
            setRoomId(roomId);
            sessionStorage.setItem("roomId", roomId);
        });
        console.log('roomId', roomId);
        return () => {
            socket?.off('in-room');
            socket?.off('joined-room');
        }
    }, [roomId, isMatchmaking]);

    useEffect(() => {
      if (roomId && isMatchmaking && player1User && player2User) {
        const gameData = {
          roomId,
          player1User,
          player2User,
        }

        setGameState(gameData);
        const timeout = setTimeout(() => {
          router.push('/game');
        }, 5000);

        return () => {
          clearTimeout(timeout);
        }
      }
    }, [roomId, isMatchmaking, player1User, player2User, router]);

    return (
        <div className="flex flex-col h-screen gap-5 relative">
          <button className="bg-mygrey" onClick={handleMatchmaking} disabled={isMatchmaking}>
            {isMatchmaking ? 'Matchmaking in progress' : 'Matchmaking'}
          </button>
          <button className="bg-mygrey" onClick={handleGameOver}>
            {'Game Over'}
          </button>
          {
            roomId && isMatchmaking && player1User && player2User && (
              <div className="loading-container absolute top-20 w-4/5 h-3/5 left-1/2 transform -translate-x-1/2">
                <div className="flex justify-between bg-black p-4 rounded-lg h-full">
                  <div className="flex flex-col items-center justify-top">
                    <p className="text-white">Player 1: {player1User?.username}</p>
                        {/* <Avatar src={player1User?.avatar || ""} 
                        alt="user avatar"
                        width={150}
                        height={150}
                        /> */}
                        <Image
                          className="transform hover:scale-125 object-cover rounded-full"
                          src={player1User?.avatar || ""}
                          alt="user avatar"
                          width={150}
                          height={150}
                        />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-white text-4xl font-bold">VS</p>
                  </div>
                  <div className="flex flex-col items-center justify-end">
                    <p className="text-white">Player 2: {player2User?.username}</p>
                    {/* <Avatar src={player2User?.avatar || ""} 
                      alt="user avatar"
                      width={150}
                      height={150}
                    /> */}
                      <Image
                        className="transform hover:scale-125 object-cover rounded-full"
                        src={player2User?.avatar || ""}
                        alt="user avatar"
                        width={150}
                        height={150}
                      />
                  </div>
                </div>
              </div>
            )
          }
        </div>
      )
}

export default MatchMaking;
