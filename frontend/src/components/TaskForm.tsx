import { type FormEvent } from "react";

interface TaskFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    dueDate: string;
  }) => void;
  isSubmitting?: boolean;
}

export const TaskForm = ({ onSubmit, isSubmitting = false }: TaskFormProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const data = {
      title: form.get("title") as string,
      description: form.get("description") as string,
      dueDate: form.get("dueDate") as string,
    };
    onSubmit(data);
    e.currentTarget.reset();
  };

  return (
    <form className="grid gap-4 mt-5 text-slate-500" onSubmit={handleSubmit}>
      <div className="grid gap-1">
        <label htmlFor="title" className="mr-2">
          Title:
        </label>
        <input
          id="title"
          type="text"
          name="title"
          className="p-2 border border-slate-500 rounded-lg"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="description" className="mr-2">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          className="p-2 border border-slate-500 rounded-lg min-h-[80px]"
          disabled={isSubmitting}
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="dueDate" className="mr-2">
          Due Date:
        </label>
        <input
          id="dueDate"
          type="date"
          name="dueDate"
          className="p-2 border border-slate-500 rounded-lg"
          disabled={isSubmitting}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="p-2 border border-slate-500 rounded-lg mt-5 cursor-pointer hover:bg-slate-700 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
};
