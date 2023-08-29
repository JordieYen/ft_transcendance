import { create } from "zustand";
import * as PIXI from "pixi.js";

export interface GameAnime {
  startAnimate: boolean;
  winPlayer: number;
  yPos: number;
}

interface GameAnimeStore {
  textures: any[];
  gameAnime: GameAnime;
  setTextures: (textures: any[]) => void;
  setGameAnime: (gameAnime: GameAnime) => void;
}

const useGameAnimeStore = create<GameAnimeStore>((set) => ({
  textures: [],
  gameAnime: {
    startAnimate: false,
    winPlayer: 0,
    yPos: 0,
  },
  setTextures: (textures) => set({ textures }),
  setGameAnime: (gameAnime) => set({ gameAnime }),
}));

export default useGameAnimeStore;
