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
  authentication: boolean;
  authenticationString: string;
  p1_match: string;
  stat: Stat;
  userAchievement: string;
  firstTimeLogin: boolean;
  socketId: string;
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
    userAchievement: "",
    firstTimeLogin: false,
    socketId: "",
  },
  setUserData: (userData) => set({ userData }),
}));

export default useUserStore;
