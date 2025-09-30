import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskDialog } from "./components/TaskDialog";
import type { TaskWithID } from "../../types";

function App() {
  const [selectedTask, setSelectedTask] = useState<TaskWithID | null>(null);

  const {
    tasks,
    isLoading,
    error,
    createTask,
    updateTaskStatus,
    deleteTask,
    isCreating,
    isUpdating,
    isDeleting,
  } = useTasks();

  const handleCreateTask = (data: {
    title: string;
    description: string;
    dueDate: string;
  }) => {
    createTask(data);
  };

  const handleMarkComplete = (id: number) => {
    updateTaskStatus({ id, status: "completed" });
  };

  const handleMarkPending = (id: number) => {
    updateTaskStatus({ id, status: "pending" });
  };

  const handleDeleteTask = (id: number) => {
    deleteTask(id);
  };

  if (error) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error loading tasks: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold mt-5">Task Manager</h1>
        <p className="text-slate-600 mt-2">Organize your tasks efficiently</p>
      </header>

      <TaskForm onSubmit={handleCreateTask} isSubmitting={isCreating} />

      <TaskList
        tasks={tasks}
        onTaskClick={setSelectedTask}
        isLoading={isLoading}
      />

      <TaskDialog
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onMarkComplete={handleMarkComplete}
        onMarkPending={handleMarkPending}
        onDelete={handleDeleteTask}
        isUpdating={isUpdating}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default App;
