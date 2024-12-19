import { create } from "zustand";

interface ratingStore {
  potentialProbabilityRating: number | null;
  setPotentialProbabilityRating: (rating: number) => void;
  residualProbabilityRating: number | null;
  setResidualProbabilityRating: (rating: number) => void;
  severityRating: number | null;
  setSeverityRating: (rating: number) => void;
}

export const useRatingStore = create<ratingStore>((set) => ({
  potentialProbabilityRating: null,
  setPotentialProbabilityRating: (rating) =>
    set({ potentialProbabilityRating: rating || null }),
  residualProbabilityRating: null,
  setResidualProbabilityRating: (rating) =>
    set({ residualProbabilityRating: rating || null }),
  severityRating: null,
  setSeverityRating: (rating) => set({ severityRating: rating || null }),
}));
