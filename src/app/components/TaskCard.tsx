import React from 'react';
import styles from '../components/TaskCard/TaskCard.module.css';
import type { Task, TaskCardProps } from '../components/TaskCard/TaskCard';

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  currentUserEmail,
}) => {
  const isOwner = task.userEmail === currentUserEmail;
  const isDark =
    typeof window !== 'undefined' && document.body.classList.contains('dark');

  return (
    <div className="hide-scrollbar max-h-[some-height]">
      <div className={`${styles.card} ${isDark ? styles.cardDark : ''}`}>
        <div className={styles.topRight}>
          {isOwner && (
            <>
              <span className={styles.editDelete} onClick={() => onEdit(task)}>
                ✏️
              </span>
              <span
                className={styles.editDelete}
                onClick={() => onDelete(task._id)}
              >
                🗑️
              </span>
            </>
          )}
        </div>

        <h3
          className={`${styles.title} ${
            task.completed ? styles.completed : ''
          }`}
        >
          {task.title}{' '}
          <span className={styles.priority}>({task.priority})</span>
        </h3>
        <p>{task.description}</p>
        <p className={styles.textGray}>Due: {task.dueDate}</p>
        <p className={styles.textGray}>
          Owner: {task.userEmail}
          {task.collaborators && task.collaborators.length > 0 && (
            <span className={`${styles.block} ${styles.mt1}`}>
              Shared with: {task.collaborators.join(', ')}
            </span>
          )}
        </p>
        <p className={styles.textGray}>
          {task.completed ? 'Completed' : 'Pending'}
        </p>
      </div>
    </div>
  );
};
