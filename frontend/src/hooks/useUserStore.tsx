import { create } from "zustand";

export interface UserData {
  avatar: string;
  id: number | null;
  intra_uid: string;
  username: string;
  online: boolean;
  authentication: boolean;
  authenticationString: string;
  p1_match: string;
  stat: { current_mmr: number };
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
    authenticationString: "",
    p1_match: "",
    stat: { current_mmr: 0 },
    userAchievement: "",
  },
  setUserData: (userData) => set({ userData }),
}));

export default useUserStore;
