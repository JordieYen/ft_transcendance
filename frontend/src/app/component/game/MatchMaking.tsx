import { SocketContext } from "@/app/socket/SocketProvider";
import { use, useContext, useEffect, useState } from "react";
import Avatar from "../header_icon/Avatar";
import Image from "next/image";
import { useRouter } from "next/router";
import { useGameData } from "./GameContext";
import useUserStore, { UserData } from "@/store/useUserStore";
import * as PIXI from 'pixi.js';


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
        // const timeout = setTimeout(() => {
        //   router.push('/game');
        // }, 5000);
        
        const loadingContainer = document.querySelector('.loading-container');
        const width = loadingContainer?.clientWidth || 400;
        const app = new PIXI.Application({
          width: width,
          height: 40,
        });
        
        loadingContainer?.appendChild(app.view as HTMLCanvasElement);

        // const loadingBar = new PIXI.Graphics();
        // loadingBar.beginFill(0x000000);
        // loadingBar.drawRect(0, 0, width, 40);
        // loadingBar.endFill();
        // app.stage.addChild(loadingBar);
        const loadingBar = PIXI.Sprite.from("/bracket.png");
        // loadingBar.width = 0;
        loadingBar.height = 40;
        // loadingBar.anchor.x = 0;
        loadingBar.x = -loadingBar.width;
        app.stage.addChild(loadingBar);

        const redBorder = new PIXI.Graphics();
        redBorder.lineStyle(4, 0xCA4754, 1);
        redBorder.drawRect(0, 0, width, 40);
        app.stage.addChild(redBorder);

        let currentCountdown = 0;
        const countdownInterval = setInterval(() => {
          currentCountdown++;
          if (currentCountdown > 6) {
            clearInterval(countdownInterval);
            // router.push('/game');
          }
          const progressWidth = (currentCountdown / 6) * width;
          // loadingBar.width = progressWidth;
          loadingBar.x = progressWidth - loadingBar.width;
          // loadingBar.clear();
          // loadingBar.beginFill(0xE2B714);
          // loadingBar.drawRect(0, 0, progressWidth, 40);
          // loadingBar.endFill();
        }, 1000);

        return () => {
          clearInterval(countdownInterval);
          loadingContainer?.removeChild(app.view as HTMLCanvasElement);
          app.destroy();
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
