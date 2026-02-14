'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import { useTasksStore } from '@/store/tasks';
import { useTasks } from '@/hooks/useTasks';
import TaskItem from '@/components/TaskItem';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <TasksDashboard />
    </ProtectedRoute>
  );
}

function TasksDashboard() {
  const tasks = useTasksStore((state) => state.tasks);
  const setTasks = useTasksStore((state) => state.setTasks);
  const addTask = useTasksStore((state) => state.addTask);
  const setLoading = useTasksStore((state) => state.setLoading);
  const isLoading = useTasksStore((state) => state.isLoading);

  const { getTasks, createTask } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
  });

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      toast.error('Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    try {
      const created = await createTask({
        title: newTask.title,
        description: newTask.description || undefined,
        priority: newTask.priority,
        dueDate: newTask.dueDate || undefined,
        status: 'PENDING',
      });

      addTask(created);
      setNewTask({
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
      });
      setShowForm(false);
      toast.success('Tarefa criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar tarefa');
    }
  };

  const pendingTasks = tasks.filter((t) => t.status === 'PENDING');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Gerencie suas tarefas de forma eficiente</p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{tasks.length}</div>
            <div className="text-gray-600">Total de Tarefas</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600">{pendingTasks.length}</div>
            <div className="text-gray-600">Pendentes</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{inProgressTasks.length}</div>
            <div className="text-gray-600">Em Progresso</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{completedTasks.length}</div>
            <div className="text-gray-600">Concluídas</div>
          </div>
        </Card>
      </div>

      {/* Formulário de nova tarefa */}
      {showForm && (
        <Card>
          <h2 className="text-xl font-bold mb-4">Nova Tarefa</h2>
          <form onSubmit={handleCreateTask} className="space-y-4">
            <Input
              label="Título"
              type="text"
              placeholder="Digite o título da tarefa"
              value={newTask.title}
              onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
              <textarea
                placeholder="Digite a descrição (opcional)"
                value={newTask.description}
                onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="LOW">Baixa</option>
                  <option value="MEDIUM">Média</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data de Vencimento</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" variant="primary">
                Criar Tarefa
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      )}

      {!showForm && (
        <Button variant="primary" onClick={() => setShowForm(true)} size="lg">
          ➕ Nova Tarefa
        </Button>
      )}

      {/* Lista de tarefas */}
      {isLoading ? (
        <div className="text-center py-8">Carregando tarefas...</div>
      ) : tasks.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-600">Nenhuma tarefa criada ainda</p>
            <Button variant="primary" onClick={() => setShowForm(true)} className="mt-4">
              Criar a primeira tarefa
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Pendentes ({pendingTasks.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pendingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {inProgressTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">⏳ Em Progresso ({inProgressTasks.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgressTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">✅ Concluídas ({completedTasks.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
