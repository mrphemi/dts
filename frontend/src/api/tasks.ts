import { type Task } from "../../../types";

const API_BASE_URL = "/api";

type TransformedTaskType = Task & {
  id: number;
};

export const tasksApi = {
  getTasks: async (): Promise<{ tasks: TransformedTaskType[] }> => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    return response.json();
  },

  getTaskById: async (id: number): Promise<{ task: TransformedTaskType }> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch task");
    }
    return response.json();
  },

  createTask: async (data: {
    title: string;
    description: string;
    dueDate: string | number;
  }): Promise<{ task: Task }> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate || new Date().toISOString(),
        status: "pending",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }
    return response.json();
  },

  updateTaskStatus: async (
    id: number,
    status: "pending" | "completed"
  ): Promise<{ task: number }> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update task status");
    }
    return response.json();
  },

  deleteTask: async (id: number): Promise<{ task: number }> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }
    return response.json();
  },
};
