import create from "zustand";
import { IEditControlMeasures } from "../../../helpers/type";

interface ControlMeasureStore {
  editedControlMeasure: IEditControlMeasures[];
  setEditedControlMeasure: (
    editedControlMeasure: IEditControlMeasures[]
  ) => void;
  isEditControlMeasure: boolean;
  setIsEditControlMeasure: (isEditControlMeasure: boolean) => void;
}

export const useControlMeasureStore = create<ControlMeasureStore>((set) => ({
  editedControlMeasure: null,
  setEditedControlMeasure: (editedControlMeasure) =>
    set({ editedControlMeasure }),
  isEditControlMeasure: false,
  setIsEditControlMeasure: (isEditControlMeasure) =>
    set({ isEditControlMeasure }),
}));
