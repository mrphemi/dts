import * as Dialog from "@radix-ui/react-dialog";

import type { TaskWithID } from "../../../types";
import { formatDate } from "../utils";

interface TaskDialogProps {
  task: TaskWithID | null;
  onClose: () => void;
  onMarkComplete: (id: number) => void;
  onMarkPending: (id: number) => void;
  onDelete: (id: number) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const TaskDialog = ({
  task,
  onClose,
  onMarkComplete,
  onMarkPending,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: TaskDialogProps) => {
  if (!task) return null;

  const handleStatusToggle = () => {
    if (task.status === "pending") {
      onMarkComplete(task.id);
    } else {
      onMarkPending(task.id);
    }
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
      onClose();
    }
  };

  return (
    <Dialog.Root open={!!task} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" />
        <Dialog.Content className="bg-white pt-6 p-4 md:p-8 text-black fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-xl animate-in fade-in zoom-in-95">
          <Dialog.Title className="font-bold text-2xl">
            {task.title}
          </Dialog.Title>

          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-500 mb-1">
                Description
              </h4>
              <Dialog.Description className="text-slate-700">
                {task.description || "No description provided"}
              </Dialog.Description>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-500 mb-1">
                Due Date
              </h4>
              <p className="text-slate-700">{formatDate(task.dueDate)}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 mb-1">
                Status
              </h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.status === "completed" ? "Completed" : "Pending"}
              </span>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              onClick={handleStatusToggle}
              disabled={isUpdating || isDeleting}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                task.status === "pending"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-slate-600 hover:bg-slate-700 text-white"
              }`}
            >
              {isUpdating
                ? "Updating..."
                : task.status === "pending"
                ? "Mark Complete"
                : "Mark Pending"}
            </button>

            <button
              onClick={handleDelete}
              disabled={isUpdating || isDeleting}
              className="px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700 cursor-pointer text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>

          <Dialog.Close
            className="absolute top-3 right-3 cursor-pointer hover:bg-slate-100 rounded-full p-1 transition"
            onClick={onClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
