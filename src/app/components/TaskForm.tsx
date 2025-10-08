import React from 'react';

type Task = {
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
};

type TaskFormProps = {
  formTask: Task;
  setFormTask: (task: Task) => void;
  collaboratorsInput: string;
  handleCollaboratorsInput: (val: string) => void;
  saveTask: () => void;
  resetForm: () => void;
  formCollaborators: string[];
  setFormCollaborators: (arr: string[]) => void;
  onClose: () => void;
};

export const TaskForm: React.FC<TaskFormProps> = ({
  formTask,
  setFormTask,
  collaboratorsInput,
  handleCollaboratorsInput,
  saveTask,
  resetForm,
  formCollaborators,
  setFormCollaborators,
  onClose,
}) => {
  return (
    <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded p-6 max-w-md w-full shadow-lg z-50">
      <div className="absolute top-2 right-2 flex gap-2">
        <button onClick={onClose}>❌</button>
      </div>

      <label className="block mb-2">Title</label>
      <input
        type="text"
        className="w-full border rounded px-2 py-1 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
        value={formTask.title}
        onChange={(e) => setFormTask({ ...formTask, title: e.target.value })}
      />

      <label className="block mb-2">Description</label>
      <textarea
        className="w-full border rounded px-2 py-1 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
        value={formTask.description}
        onChange={(e) =>
          setFormTask({ ...formTask, description: e.target.value })
        }
      />

      <label className="block mb-2">Due Date</label>
      <input
        type="date"
        className="w-full border rounded px-2 py-1 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
        value={formTask.dueDate}
        onChange={(e) => setFormTask({ ...formTask, dueDate: e.target.value })}
      />

      <label className="block mb-2">Priority</label>
      <select
        className="w-full border rounded px-2 py-1 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
        value={formTask.priority}
        onChange={(e) =>
          setFormTask({
            ...formTask,
            priority: e.target.value as typeof formTask.priority,
          })
        }
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <label className="block mb-2">
        Collaborators (emails, comma-separated)
        <input
          type="text"
          className="w-full border rounded px-2 py-1 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          value={collaboratorsInput}
          onChange={(e) => handleCollaboratorsInput(e.target.value)}
        />
      </label>

      <label className="block mb-2">
        <input
          type="checkbox"
          checked={formTask.completed}
          onChange={(e) =>
            setFormTask({ ...formTask, completed: e.target.checked })
          }
        />{' '}
        Completed
      </label>

      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={saveTask}
        >
          Save
        </button>
      </div>
    </div>
  );
};
