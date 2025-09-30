import type { TaskWithID } from "../../../types";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: TaskWithID[];
  onTaskClick: (task: TaskWithID) => void;
  isLoading?: boolean;
}

export const TaskList = ({
  tasks,
  onTaskClick,
  isLoading = false,
}: TaskListProps) => {
  if (isLoading) {
    return (
      <div className="mt-10 text-center text-slate-500">
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="mt-10 text-center text-slate-500">
        <p>No tasks yet. Create your first task above!</p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 mt-10">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onClick={() => onTaskClick(task)} />
      ))}
    </ul>
  );
};
