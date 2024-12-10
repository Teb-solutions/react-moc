import { create } from "zustand";
import { ITask } from "../../../helpers/type";

interface taskStore {
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
  selectedTask: ITask | null;
  setSelectedTask: (task: ITask) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  selectedTasksIds: number[];
  setSelectedTasksIds: (ids: number[]) => void;
}

export const useTaskStore = create<taskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task }),
  loading: true,
  setLoading: (loading) => set({ loading }),
  selectedTasksIds: [],
  setSelectedTasksIds: (ids) => set({ selectedTasksIds: ids }),
}));
