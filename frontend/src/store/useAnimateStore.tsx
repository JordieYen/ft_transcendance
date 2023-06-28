import { create } from "zustand";

export type Step = "name" | "avatar" | "tfa" | "";
export type Page = "main" | "setup" | "";

interface AnimateStore {
  currentStep: Step;
  currentPage: Page;
  setCurrentStep: (step: Step) => void;
  setCurrentPage: (page: Page) => void;
}

const useAnimateStore = create<AnimateStore>((set) => ({
  currentStep: "",
  currentPage: "",
  setCurrentStep: (currentStep) => set({ currentStep }),
  setCurrentPage: (currentPage) => set({ currentPage }),
}));

export default useAnimateStore;
