import { useCallback } from 'react';
import { useAuthStore } from '@/store/auth';
import { tasksAPI } from '@/lib/api';
import type { Task } from '@/types';

export const useTasks = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const getTasks = useCallback(async (): Promise<Task[]> => {
    if (!isAuthenticated) return [];
    try {
      const response = await tasksAPI.getAll();
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }, [isAuthenticated]);

  const createTask = useCallback(
    async (task: Partial<Task>): Promise<Task> => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      const response = await tasksAPI.create(task);
      return response.data;
    },
    [isAuthenticated],
  );

  const updateTask = useCallback(
    async (id: string, task: Partial<Task>): Promise<Task> => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      const response = await tasksAPI.update(id, task);
      return response.data;
    },
    [isAuthenticated],
  );

  const deleteTask = useCallback(
    async (id: string): Promise<void> => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      await tasksAPI.delete(id);
    },
    [isAuthenticated],
  );

  return { getTasks, createTask, updateTask, deleteTask };
};
