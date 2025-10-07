'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { TaskCard } from './components/TaskCard';
import { TaskForm } from './components/TaskForm';
import ThemeToggle from './context/ThemeToggle';
import { ThemeContext } from './context/ThemeContext';

type Task = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  userEmail: string;
  collaborators: string[];
};

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formTask, setFormTask] = useState<
    Omit<Task, '_id' | 'userEmail' | 'collaborators'>
  >({
    title: '',
    description: '',
    dueDate: '',
    completed: false,
    priority: 'Low',
  });
  const [collaboratorsInput, setCollaboratorsInput] = useState('');
  const [formCollaborators, setFormCollaborators] = useState<string[]>([]);

  const themeContext = useContext(ThemeContext);
  const isDark = themeContext?.theme === 'dark';

  useEffect(() => {
    if (!session || !session.user?.email) return;

    // Setup socket connection
    socketRef.current = io('http://10.31.69.213:4000');

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socketRef.current.on('taskAdded', (task: Task) => {
      if (
        task.userEmail === session.user?.email ||
        task.collaborators.includes(session.user?.email ?? '')
      ) {
        setTasks((prev) => [...prev, task]);
      }
    });

    socketRef.current.on('taskUpdated', (updatedTask: Task) => {
      if (
        updatedTask.userEmail === session?.user?.email ||
        updatedTask.collaborators.includes(session?.user?.email ?? '')
      ) {
        setTasks((prev) =>
          prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)),
        );
      }
    });

    socketRef.current.on('taskDeleted', (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    const fetchUserTasks = async () => {
      const res = await fetch('/api/todos');
      if (res.ok) {
        const allTasks: Task[] = await res.json();
        const userEmail = session?.user?.email ?? '';
        // Filter tasks where user is owner or collaborator
        const userTasks = allTasks.filter(
          (task) =>
            task.userEmail === userEmail ||
            (task.collaborators && task.collaborators.includes(userEmail)),
        );
        setTasks(userTasks);
      }
    };

    fetchUserTasks();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [session]);

  const resetForm = () => {
    setFormTask({
      title: '',
      description: '',
      dueDate: '',
      completed: false,
      priority: 'Low',
    });
    setEditingTaskId(null);
    setFormCollaborators([]);
    setCollaboratorsInput('');
    setIsAdding(false);
  };

  const saveTask = async () => {
    if (!formTask.title.trim()) {
      alert('Title is required');
      return;
    }
    let url = '/api/todos';
    let method = 'POST';
    let body: any = {
      ...formTask,
      userEmail: session?.user?.email,
      collaborators: formCollaborators,
    };

    if (editingTaskId) {
      method = 'PUT';
      body = { ...body, id: editingTaskId };
    }

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      resetForm();
      const data = await res.json();

      if (socketRef.current) {
        if (method === 'POST') {
          socketRef.current.emit('addTask', { ...body, _id: data.insertedId });
        } else {
          socketRef.current.emit('updateTask', { ...body });
        }
      }

      const refreshed = await fetch('/api/todos');
      if (refreshed.ok) {
        const allTasks: Task[] = await refreshed.json();
        const userEmail = session?.user?.email ?? '';
        const userTasks = allTasks.filter(
          (task) =>
            task.userEmail === userEmail ||
            (task.collaborators && task.collaborators.includes(userEmail)),
        );
        setTasks(userTasks);
      }
    } else {
      console.error('Failed to save task');
    }
  };

  const startEdit = (task: Task) => {
    setFormTask({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      completed: task.completed,
      priority: task.priority,
    });
    setEditingTaskId(task._id);
    setFormCollaborators(task.collaborators ?? []);
    setCollaboratorsInput((task.collaborators ?? []).join(', '));
    setIsAdding(true);
  };

  const handleCollaboratorsInput = (val: string) => {
    setCollaboratorsInput(val);
    const arr = val
      .split(',')
      .map((e) => e.trim())
      .filter(Boolean)
      .filter((e) => e !== session?.user?.email);
    setFormCollaborators(arr);
  };

  const deleteTask = async (id: string) => {
    const res = await fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t._id !== id));
      if (socketRef.current) {
        socketRef.current.emit('deleteTask', id);
      }
    } else {
      console.error('Failed to delete task');
    }
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  if (status === 'loading')
    return (
      <div className="max-w-md mx-auto mt-10 p-4 border rounded animate-pulse">
        <div className="h-8 bg-gray-300 rounded mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="border p-4 rounded bg-gray-200">
              <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded mb-1 w-5/6"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );

  if (!session)
    return (
      <div className="text-center mt-20">
        <div className="text-xl mb-4">Please log in to manage your tasks.</div>
        <button onClick={() => router.push('/auth/login')} className="btn-blue">
          Login
        </button>
        <button
          onClick={() => router.push('/auth/signup')}
          className="btn-green ml-2"
        >
          Sign Up
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto min-h-screen relative px-4 pt-20 pb-20">
      <div className="fixed top-4 right-4 z-50 flex flex-row items-center gap-3">
        <ThemeToggle className="w-9 h-9 flex items-center justify-center" />
        <button
          onClick={logout}
          className="w-10 h-10 flex items-center justify-center rounded-md bg-red-600 hover:bg-red-700 text-white shadow transition"
          aria-label="Logout"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V4m0 12a4 4 0 01-8 0V8a4 4 0 018 0z"
            />
          </svg>
        </button>
      </div>

      {!isAdding && (
        <button
          onClick={() => {
            resetForm();
            setIsAdding(true);
          }}
          className="fixed top-1/2 right-6 z-50 w-8 h-8 flex items-center justify-center rounded-full bg-green-600 hover:bg-green-700 text-white shadow transition -translate-y-1/2"
          aria-label="Add Task"
          title="Add Task"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}

      <h1
        className={`fixed w-full top-4 left-0 right-0 text-center text-3xl font-bold py-2 shadow z-40 transition-colors
  ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-slate-900'}
`}
      >
        Task List
      </h1>

      {isAdding && (
        <TaskForm
          formTask={formTask}
          setFormTask={setFormTask}
          collaboratorsInput={collaboratorsInput}
          handleCollaboratorsInput={handleCollaboratorsInput}
          saveTask={saveTask}
          resetForm={resetForm}
          formCollaborators={formCollaborators}
          setFormCollaborators={setFormCollaborators}
          onClose={() => setIsAdding(false)}
        />
      )}

      <div className="fixed top-24 bottom-16 left-0 right-0 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 overflow-y-auto h-full">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={startEdit}
              onDelete={deleteTask}
              currentUserEmail={session?.user?.email ?? ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
