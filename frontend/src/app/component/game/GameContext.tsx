import { UserData } from "@/store/useUserStore";
import { createContext, ReactNode, use, useContext, useEffect, useState } from "react";

interface GameContextProps {
    gameState: any;
    setGameState: (state: any) => void;
    gameInvitation: GameInvitationProps | null;
    clearGameInvitation: () => void;
    handleInviteGame: (data: {user: UserData; friend: UserData}) => GameInvitationProps | null;
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
};


export const GameContext = createContext<GameContextProps>(defaultGameContext);

export const GameProvider = ({ children }: {children: ReactNode}) => {
    const [gameState, setGameState] = useState<any>(null);
    const [gameInvitation, setGameInvitation] = useState<GameInvitationProps | null>(null);

    const clearGameInvitation = () => {
        setGameInvitation(null);
    };
    
    const handleInviteGame = (data: {user: UserData; friend: UserData}) => {
        // console.log('Game invitation from', data.user);
        // console.log('Game invitation to', data.friend);
        setGameInvitation({
            user: data.user,
            friend: data.friend,
            onAccept: () => {},
            onDecline: () => {},
        });
    };

    return (
        <GameContext.Provider value={{ gameState, setGameState, gameInvitation, clearGameInvitation, handleInviteGame }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameData = () => useContext(GameContext);
