import { create } from "zustand";

export interface UserData {
  avatar: string;
  id: number | null;
  intra_uid: string;
  username: string;
  online: boolean;
  authentication: boolean;
  p1_match: string;
  stat: { mmr: number };
  userAchievement: string;
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
    p1_match: "",
    stat: { mmr: 0 },
    userAchievement: "",
  },
  setUserData: (userData) => set({ userData }),
}));

export default useUserStore;
