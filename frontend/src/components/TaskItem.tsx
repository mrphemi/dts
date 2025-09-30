import type { Task } from "../../../types";
import { formatDate } from "../utils";

interface TaskItemProps {
  task: Task;
  onClick: () => void;
}

export const TaskItem = ({ task, onClick }: TaskItemProps) => {
  return (
    <li
      onClick={onClick}
      className="flex justify-between items-center border border-slate-500 rounded-lg p-4 hover:bg-slate-500 hover:text-white cursor-pointer transition"
    >
      <div className="flex-1">
        <h3 className="font-semibold">{task.title}</h3>
        <p className="text-xs opacity-80 mt-1">
          Due: {formatDate(task.dueDate)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            task.status === "completed"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {task.status === "completed" ? "Completed" : "Pending"}
        </span>
      </div>
    </li>
  );
};
