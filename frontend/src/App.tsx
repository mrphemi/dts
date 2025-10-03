import { useState } from "react";
import { useTasks } from "./hooks/useTasks";
import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { TaskDialog } from "./components/TaskDialog";

function App() {
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  const { tasks, isLoading, error } = useTasks();

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
        <p className="text-slate-600 mt-2">Organize your tasks efficiently.</p>
      </header>

      <TaskForm />

      <TaskList
        tasks={tasks}
        onTaskClick={setSelectedTaskId}
        isLoading={isLoading}
      />

      <TaskDialog
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
}

export default App;
