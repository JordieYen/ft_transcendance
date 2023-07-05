import { create } from "zustand";

export type Step = "name" | "avatar" | "tfa" | "start";
export type Page = "main" | "setup" | "";

interface AnimateStore {
  currentStep: Step;
  currentPage: Page;
  setCurrentStep: (step: Step) => void;
  setCurrentPage: (page: Page) => void;
}

const useAnimateStore = create<AnimateStore>((set) => ({
  currentStep: "start",
  currentPage: "",
  setCurrentStep: (currentStep) => set({ currentStep }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}));

export default useAnimateStore;
