import { create } from "zustand";
import { IRiskRegisterDetails } from "../../../helpers/type";

interface RiskStore {
  risk: IRiskRegisterDetails;
  setRisk: (risk: IRiskRegisterDetails) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isCurrentUserPartOfTeam: boolean;
  setIsCurrentUserPartOfTeam: (isCurrentUserPartOfTeam: boolean) => void;
  isTaskApprover: boolean;
  setIsTaskApprover: (isTaskApprover: boolean) => void;
  isSessionActive: boolean;
  setIsSessionActive: (isSessionActive: boolean) => void;
}

export const useRiskStore = create<RiskStore>((set) => ({
  risk: null,
  setRisk: (risk) => set({ risk }),
  loading: true,
  setLoading: (loading) => set({ loading }),
  isCurrentUserPartOfTeam: false,
  setIsCurrentUserPartOfTeam: (isCurrentUserPartOfTeam) =>
    set({ isCurrentUserPartOfTeam }),
  isTaskApprover: false,
  setIsTaskApprover: (isTaskApprover) => set({ isTaskApprover }),
  isSessionActive: false,
  setIsSessionActive: (isSessionActive) => set({ isSessionActive }),
}));
