'use client';

import { useEffect, useState } from 'react';
import { useTasksStore } from '@/store/tasks';
import { useTasks } from '@/hooks/useTasks';
import { useAuthStore } from '@/store/auth';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { Task } from '@/types';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function TaskItem({ task }: { task: Task }) {
  const updateTask = useTasksStore((state) => state.updateTask);
  const removeTask = useTasksStore((state) => state.removeTask);
  const { updateTask: updateTaskAPI, deleteTask: deleteTaskAPI } = useTasks();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editStatus, setEditStatus] = useState(task.status);
  const [editPriority, setEditPriority] = useState(task.priority);

  const handleUpdate = async () => {
    try {
      if (!editTitle.trim()) {
        toast.error('Título não pode estar vazio');
        return;
      }

      const updated = await updateTaskAPI(task.id, {
        ...task,
        title: editTitle,
        status: editStatus,
        priority: editPriority,
      });

      updateTask(task.id, updated);
      setIsEditing(false);
      toast.success('Tarefa atualizada!');
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    try {
      await deleteTaskAPI(task.id);
      removeTask(task.id);
      toast.success('Tarefa deletada!');
    } catch (error) {
      toast.error('Erro ao deletar tarefa');
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      LOW: 'bg-green-100 text-green-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      URGENT: 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      ARCHIVED: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      {isEditing ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full px-3 py-2 text-gray-600 border border-gray-300 rounded-lg"
            placeholder="Título da tarefa"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as any)}
              className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg"
            >
              <option value="PENDING">Pendente</option>
              <option value="IN_PROGRESS">Em Progresso</option>
              <option value="COMPLETED">Concluída</option>
              <option value="ARCHIVED">Arquivada</option>
            </select>

            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as any)}
              className="px-3 py-2 text-gray-600 border border-gray-300 rounded-lg"
            >
              <option value="LOW">Baixa</option>
              <option value="MEDIUM">Média</option>
              <option value="HIGH">Alta</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleUpdate}>
              Salvar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
              <Button variant="danger" size="sm" onClick={handleDelete}>
                Deletar
              </Button>
            </div>
          </div>

          {task.description && <p className="text-gray-600 mb-4">{task.description}</p>}

          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
              {task.status === 'PENDING'
                ? 'Pendente'
                : task.status === 'IN_PROGRESS'
                  ? 'Em Progresso'
                  : task.status === 'COMPLETED'
                    ? 'Concluída'
                    : 'Arquivada'}
            </span>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
              {task.priority === 'LOW'
                ? 'Baixa'
                : task.priority === 'MEDIUM'
                  ? 'Média'
                  : task.priority === 'HIGH'
                    ? 'Alta'
                    : 'Urgente'}
            </span>
          </div>

          {task.dueDate && (
            <p className="text-sm text-gray-500">
              Vencimento:{' '}
              {formatDistanceToNow(new Date(task.dueDate), {
                addSuffix: true,
                locale: ptBR,
              })}
            </p>
          )}
        </>
      )}
    </Card>
  );
}
