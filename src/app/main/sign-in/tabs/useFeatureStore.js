// src/store/featureStore.js
import create from "zustand";
import { devtools } from "zustand/middleware";

const useFeatureStore = create(
  devtools(
    (set) => ({
      features: [],
      setFeatures: (newFeatures) => set({ features: newFeatures }),
      clearFeatures: () => set({ features: [] }),
    }),
    { name: "FeatureStore" }
  )
);

export default useFeatureStore;
