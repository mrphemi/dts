import { createRoute } from "@hono/zod-openapi";

import {
  CreateTaskSchema,
  UpdateTaskSchema,
  ParamsSchema,
  TaskListResponseSchema,
  TaskResponseSchema,
  TaskCreatedResponseSchema,
  TaskUpdateResponseSchema,
  TaskDeleteResponseSchema,
  NotFoundErrorSchema,
  ValidationErrorSchema,
  ServerErrorSchema,
} from "../lib/openapi-schemas.js";

// Define routes with OpenAPI spec

// Get All Tasks
export const getAllTasksRoute = createRoute({
  method: "get",
  path: "/tasks",
  tags: ["Tasks"],
  summary: "Get all tasks",
  description: "Retrieve a list of all tasks",
  responses: {
    200: {
      description: "List of tasks",
      content: {
        "application/json": {
          schema: TaskListResponseSchema,
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: ServerErrorSchema,
        },
      },
    },
  },
});

// Get Task by ID
export const getTaskByIdRoute = createRoute({
  method: "get",
  path: "/tasks/{id}",
  tags: ["Tasks"],
  summary: "Get task by ID",
  description: "Retrieve a specific task by its ID",
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      description: "Task found",
      content: {
        "application/json": {
          schema: TaskResponseSchema,
        },
      },
    },
    400: {
      description: "Invalid ID format",
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
    },
    404: {
      description: "Task not found",
      content: {
        "application/json": {
          schema: NotFoundErrorSchema,
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: ServerErrorSchema,
        },
      },
    },
  },
});

// Create Task
export const createTaskRoute = createRoute({
  method: "post",
  path: "/tasks",
  tags: ["Tasks"],
  summary: "Create a new task",
  description:
    "Create a new task with title, description, status, and due date",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateTaskSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    201: {
      description: "Task created successfully",
      content: {
        "application/json": {
          schema: TaskCreatedResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: ServerErrorSchema,
        },
      },
    },
  },
});

// Delete Task
export const deleteTaskRoute = createRoute({
  method: "delete",
  path: "/tasks/{id}",
  tags: ["Tasks"],
  summary: "Delete a task",
  description: "Delete a task by its ID",
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      description: "Task deleted successfully",
      content: {
        "application/json": {
          schema: TaskDeleteResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
    },
    404: {
      description: "Task not found",
      content: {
        "application/json": {
          schema: NotFoundErrorSchema,
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: ServerErrorSchema,
        },
      },
    },
  },
});

// Update Task Status
export const updateTaskRoute = createRoute({
  method: "put",
  path: "/tasks/{id}",
  tags: ["Tasks"],
  summary: "Update task status",
  description: "Update the status of an existing task",
  request: {
    params: ParamsSchema,
    body: {
      content: {
        "application/json": {
          schema: UpdateTaskSchema,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: "Task status updated successfully",
      content: {
        "application/json": {
          schema: TaskUpdateResponseSchema,
        },
      },
    },
    400: {
      description: "Validation error",
      content: {
        "application/json": {
          schema: ValidationErrorSchema,
        },
      },
    },
    404: {
      description: "Task not found",
      content: {
        "application/json": {
          schema: NotFoundErrorSchema,
        },
      },
    },
    500: {
      description: "Server error",
      content: {
        "application/json": {
          schema: ServerErrorSchema,
        },
      },
    },
  },
});
