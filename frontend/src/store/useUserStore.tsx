import { create } from "zustand";

interface Stat {
  current_mmr: number;
  smashes: number;
  wins: number;
  losses: number;
  kills: number;
  deaths: number;
  best_mmr: number;
  win_streak: number;
}

export interface UserData {
  avatar: string;
  id: number | null;
  intra_uid: string;
  username: string;
  online: boolean;
  createdAt: string;
  authentication: boolean;
  authenticationString: string;
  p1_match: string;
  stat: Stat;
  firstTimeLogin: boolean;
  socketId: string;
  gameMode: string;
}

interface UserStore {
  userData: UserData;
  setUserData: (userData: UserData) => void;
}

const useUserStore = create<UserStore>((set) => ({
  userData: {
    avatar: "",
    id: null,
    intra_uid: "",
    username: "",
    online: false,
    createdAt: "",
    authentication: false,
    authenticationString: "",
    p1_match: "",
    stat: {
      current_mmr: 0,
      smashes: 0,
      wins: 0,
      losses: 0,
      kills: 0,
      deaths: 0,
      best_mmr: 0,
      win_streak: 0,
    },
    firstTimeLogin: false,
    socketId: "",
    gameMode: "",
  },
  setUserData: (userData) => set({ userData }),
}));

export default useUserStore;
