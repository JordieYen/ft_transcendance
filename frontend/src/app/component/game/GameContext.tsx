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
    player1: UserData | null;
    player2: UserData | null;
    setPlayer1User: (user: UserData | null) => void;
    setPlayer2User: (user: UserData | null) => void;
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
    player1: null,
    player2: null,
    setPlayer1User: () => {},
    setPlayer2User: () => {},
};


export const GameContext = createContext<GameContextProps>(defaultGameContext);

export const GameProvider = ({ children }: {children: ReactNode}) => {
    const [gameState, setGameState] = useState<any>(null);
    const [gameInvitation, setGameInvitation] = useState<GameInvitationProps | null>(null);
    const socket = useContext(SocketContext);
    const router = useRouter();
    const [isLoadingScreenVisible, setLoadingScreenVisible] = useState(false);
    const [player1, setPlayer1User] = useState<UserData | null>(null);
    const [player2, setPlayer2User] = useState<UserData | null>(null);

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
            setPlayer1User(data.players[0].player);
            setPlayer2User(data.players[1].player);
        });
        console.log('gamestate', gameState);
        console.log('player1', player1);
        console.log('player2', player2);
        clearGameInvitation();
    }, [gameState]);

    return (
        <GameContext.Provider value={{ gameState, setGameState, gameInvitation, clearGameInvitation, handleInviteGame, isLoadingScreenVisible, setLoadingScreenVisible, player1, setPlayer1User, player2, setPlayer2User}}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameData = () => useContext(GameContext);
