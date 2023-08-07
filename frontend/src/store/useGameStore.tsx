import { create } from "zustand";

interface GameData {
  xPos: number;
  yPos: number;
  p1Score: number;
  p2Score: number;
  p1Streak: number;
  p2Streak: number;
  currentStreak: number;
  playerOne: any;
  playerTwo: any;
}

interface GameStore {
  gameData: GameData;
  setGameData: (gameData: GameData) => void;
}

const useGameStore = create<GameStore>((set) => ({
  gameData: {
    xPos: 0,
    yPos: 0,
    p1Score: 0,
    p2Score: 0,
    p1Streak: 0,
    p2Streak: 0,
    currentStreak: 0,
    playerOne: undefined,
    playerTwo: undefined,
  },
  setGameData: (gameData) => set({ gameData }),
}));

export default useGameStore;
