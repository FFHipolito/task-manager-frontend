import { create } from 'zustand';
import type { Task } from '@/types';

interface TasksStore {
  tasks: Task[];
  isLoading: boolean;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Task) => void;
  removeTask: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useTasksStore = create<TasksStore>((set) => ({
  tasks: [],
  isLoading: false,
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [task, ...state.tasks] })),
  updateTask: (id, task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? task : t)),
    })),
  removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
