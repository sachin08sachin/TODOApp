// types.ts
export type Task = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  userEmail: string;
  collaborators: string[];
};

export type TaskCardProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  currentUserEmail: string;
};
