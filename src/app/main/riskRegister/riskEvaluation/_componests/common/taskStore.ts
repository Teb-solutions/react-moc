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
  isAddTaskClicked: boolean;
  setIsAddTaskClicked: (isClicked: boolean) => void;
  isEditTaskClicked: boolean;
  setIsEditTaskClicked: (isClicked: boolean) => void;
}

export const useTaskStore = create<taskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  selectedTask: null,
  setSelectedTask: (task) => set({ selectedTask: task || null }),
  loading: true,
  setLoading: (loading) => set({ loading }),
  selectedTasksIds: [],
  setSelectedTasksIds: (ids) => set({ selectedTasksIds: ids }),
  isAddTaskClicked: false,
  setIsAddTaskClicked: (isClicked) => set({ isAddTaskClicked: isClicked }),
  isEditTaskClicked: false,
  setIsEditTaskClicked: (isClicked) => set({ isEditTaskClicked: isClicked }),
}));
