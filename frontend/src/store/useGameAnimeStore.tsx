import { create } from "zustand";

interface GameAnime {
  texture: any[];
  textureCache: boolean;
}

interface GameAnimeStore {
  gameAnime: GameAnime;
  setGameAnime: (gameAnime: GameAnime) => void;
}

const useGameAnimeStore = create<GameAnimeStore>((set) => ({
  gameAnime: {
    texture: [],
    textureCache: false,
  },
  setGameAnime: (gameAnime) => set({ gameAnime }),
}));

export default useGameAnimeStore;
