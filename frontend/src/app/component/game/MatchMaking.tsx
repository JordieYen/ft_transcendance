import { SocketContext } from "@/app/socket/SocketProvider";
import { use, useContext, useEffect, useState } from "react";
import Avatar from "../header_icon/Avatar";
import Image from "next/image";
import { useRouter } from "next/router";
import { useGameData } from "./GameContext";
import useUserStore, { UserData } from "@/store/useUserStore";
import * as PIXI from 'pixi.js';
import LoadingScreen from "./LoadingScreen";


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
    const { setGameState, isLoadingScreenVisible } = useGameData();
    const [showLoadingScreen, setShowLoadingScreen] = useState(false);


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
    }, [socket, userData, router]);

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

    // update loading bar width on resize
    const updateLoadingBarWidth = (redBorder: PIXI.Graphics, loadingContainer: Element | null, app: PIXI.Application, loadingBar: PIXI.Sprite, currentCountdown: number) => {
        loadingContainer = document.querySelector('.loading-container');
        const width = loadingContainer?.clientWidth || 400;
        const progressWidth = (currentCountdown / 6) * width;
        loadingBar.x = progressWidth - loadingBar.width;
        redBorder.drawRect(0, 0, width, 40);
        redBorder.clear();
        redBorder.lineStyle(4, 0xCA4754, 1);
        redBorder.drawRect(0, 0, width, 40);
        app.renderer.resize(width, 40);
    }

    useEffect(() => {
      if (roomId && isMatchmaking && player1User && player2User) {
        const gameData = {
          roomId,
          player1User,
          player2User,
        }

        setGameState(gameData);
        
        const loadingContainer = document.querySelector('.loading-container');
        const width = loadingContainer?.clientWidth || 400;
        const app = new PIXI.Application({
          width: width,
          height: 40,
        });
        
        loadingContainer?.appendChild(app.view as HTMLCanvasElement);

        const loadingBar = PIXI.Sprite.from("/bracket.png");
        loadingBar.height = 40;
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
          loadingBar.x = progressWidth - loadingBar.width;
        }, 1000);

        const handleResize = () => {
          console.log('handleResize');
          
          updateLoadingBarWidth(redBorder, loadingContainer, app, loadingBar, currentCountdown);
        }

        window.addEventListener('resize', handleResize);

        return () => {
          clearInterval(countdownInterval);
          window.removeEventListener('resize', handleResize);
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
            // roomId && isMatchmaking && player1User && player2User && (
            isLoadingScreenVisible && player1User && player2User && (
              <LoadingScreen player1User={player1User} player2User={player2User} />
            )
          }
        </div>
      )
}

export default MatchMaking;
