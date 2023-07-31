import { SocketContext } from "@/app/socket/SocketProvider";
import { UserData } from "@/store/useUserStore";
import { useRouter } from "next/router";
import { createContext, ReactNode, use, useContext, useEffect, useState } from "react";

interface GameContextProps {
    gameState: any;
    setGameState: (state: any) => void;
    gameInvitation: GameInvitationProps | null;
    clearGameInvitation: () => void;
    handleInviteGame: (data: {user: UserData; friend: UserData}) => void;
    isLoadingScreenVisible: boolean;
    setLoadingScreenVisible: (state: boolean) => void;
}

export interface GameInvitationProps {
    user: UserData;
    friend: UserData;
    onAccept: () => void;
    onDecline: () => void;
}

const defaultGameContext: GameContextProps = {
    gameState: null,
    setGameState: () => {},
    gameInvitation: null,
    clearGameInvitation: () => {},
    handleInviteGame: () => null,
    isLoadingScreenVisible: false,
    setLoadingScreenVisible: () => {},
};


export const GameContext = createContext<GameContextProps>(defaultGameContext);

export const GameProvider = ({ children }: {children: ReactNode}) => {
    const [gameState, setGameState] = useState<any>(null);
    const [gameInvitation, setGameInvitation] = useState<GameInvitationProps | null>(null);
    const [isLoadingScreenVisible, setLoadingScreenVisible] = useState(false);
    const socket = useContext(SocketContext);
    const router = useRouter();

    const clearGameInvitation = () => {
        setGameInvitation(null);
    };
    
    const handleInviteGame = (data: {user: UserData; friend: UserData}) => {
        // console.log('Game invitation from', data.user);
        // console.log('Game invitation to', data.friend);
        setGameInvitation({
            user: data.user,
            friend: data.friend,
            onAccept: () => {
                socket?.emit('accept-game-invitation', {
                    user: data.user,
                    friend: data.friend,
                });
            },
            onDecline: () => {
                clearGameInvitation();
            },
        });
    };

    useEffect(() => {
        socket?.on('to-loading-screen', (data: any) => {
            setGameState(data);
            setLoadingScreenVisible(true);
        });
        console.log('gamestate', gameState);
        clearGameInvitation();
    }, [gameState]);

    return (
        <GameContext.Provider value={{ gameState, setGameState, gameInvitation, clearGameInvitation, handleInviteGame, isLoadingScreenVisible, setLoadingScreenVisible, }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameData = () => useContext(GameContext);
