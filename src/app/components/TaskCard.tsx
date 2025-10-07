// components/TaskCard.tsx
import React from 'react';

type Task = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: "Low" | "Medium" | "High";
  userEmail: string;
  collaborators: string[];
};

type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  return (
    <div className="border p-4 rounded relative shadow bg-white dark:bg-gray-800 dark:text-white hover:shadow-lg transition-shadow">
      <div className="absolute top-2 right-2 flex gap-2">
        <span className="cursor-pointer" onClick={() => onEdit(task)}>✏️</span>
        <span className="cursor-pointer" onClick={() => onDelete(task._id)}>🗑️</span>
      </div>
      <h3 className={`font-semibold text-lg ${task.completed ? "line-through text-gray-400" : ""}`}>
        {task.title} <span className="text-sm font-normal">({task.priority})</span>
      </h3>
      <p>{task.description}</p>
      <p className="text-sm text-gray-500">Due: {task.dueDate}</p>
      <p className="text-sm">
        Owner: {task.userEmail}
        {Array.isArray(task.collaborators) && task.collaborators.length > 0 && (
           <span className="text-sm mt-1">Shared with: {task.collaborators.join(', ')}</span>
        )}
      </p>
      <p className="text-sm">{task.completed ? "Completed" : "Pending"}</p>
    </div>
  );
};
