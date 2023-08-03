import { createContext, ReactNode, useContext, useState } from "react";
import { GameState } from "./MatchMaking";

interface GameContextProps {
  gameState: GameState | null;
  setGameState: (state: any) => void;
}

const defaultGameContext: GameContextProps = {
  gameState: null,
  setGameState: () => {},
};

export const GameContext = createContext<GameContextProps>(defaultGameContext);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<any>(null);

  return (
    <GameContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameData = () => useContext(GameContext);
