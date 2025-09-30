import { z } from "@hono/zod-openapi";

export const TaskStatusSchema = z.enum(["pending", "completed"]).openapi({
  description: "Task status",
  example: "pending",
});

export const TaskSchema = z
  .object({
    id: z.number().int().positive().openapi({
      description: "Unique task identifier",
      example: 1,
    }),
    title: z.string().min(1).max(200).openapi({
      description: "Task title",
      example: "Complete project documentation",
    }),
    description: z.string().max(1000).nullable().openapi({
      description: "Task description (optional)",
      example: "Write comprehensive API docs",
    }),
    status: TaskStatusSchema,
    dueDate: z.iso.datetime().openapi({
      description: "Task due date in ISO 8601 format",
      example: "2024-12-31T23:59:59.000Z",
    }),
  })
  .openapi("Task");

export const CreateTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title cannot be empty")
      .max(200, "Title too long")
      .openapi({
        description: "Task title",
        example: "Complete project documentation",
      }),
    description: z
      .string()
      .max(1000, "Description too long")
      .optional()
      .nullable()
      .openapi({
        description: "Task description (optional)",
        example: "Write comprehensive API docs",
      }),
    status: TaskStatusSchema,
    dueDate: z.coerce.date().openapi({
      description: "Task due date",
      example: "2025-12-31T23:59:59.000Z",
    }),
  })
  .openapi("CreateTask");

export const UpdateTaskSchema = z
  .object({
    status: TaskStatusSchema,
  })
  .openapi("UpdateTaskStatus");

// Params Schema
export const ParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a number")
    .transform((val) => parseInt(val))
    .openapi({
      param: {
        name: "id",
        in: "path",
        description: "Task ID",
        required: true,
        example: "1",
      },
    }),
});

// Error Schemas
export const NotFoundErrorSchema = z
  .object({
    error: z.string().openapi({
      example: "Task not found",
    }),
  })
  .openapi("NotFoundError");

export const ValidationErrorSchema = z
  .object({
    message: z.string().openapi({
      example: "Error: Invalid Request",
    }),
    error: z
      .array(
        z.object({
          code: z.string().openapi({
            example: "invalid_type",
          }),
          expected: z.string().optional().openapi({
            example: "string",
          }),
          received: z.string().optional().openapi({
            example: "undefined",
          }),
          path: z.array(z.string()).openapi({
            example: ["title"],
          }),
          message: z.string().openapi({
            example: "Required",
          }),
        })
      )
      .openapi({
        description: "Array of validation errors from Zod",
      }),
  })
  .openapi("ValidationError");

export const ServerErrorSchema = z
  .object({
    error: z.string().openapi({
      example: "Failed to process request",
    }),
  })
  .openapi("ServerError");

// Success Response Schemas
export const TaskListResponseSchema = z
  .object({
    tasks: z.array(TaskSchema),
  })
  .openapi("TaskListResponse");

export const TaskResponseSchema = z
  .object({
    task: TaskSchema,
  })
  .openapi("TaskResponse");

export const TaskCreatedResponseSchema = z
  .object({
    task: TaskSchema,
  })
  .openapi("TaskCreatedResponse");

export const TaskUpdateResponseSchema = z
  .object({
    message: z.string().openapi({
      example: "Task status updated successfully",
    }),
    task: z.number().openapi({
      example: 1,
    }),
  })
  .openapi("TaskUpdateResponse");

export const TaskDeleteResponseSchema = z
  .object({
    message: z.string().openapi({
      example: "Task deleted successfully",
    }),
    task: z.number().openapi({
      example: 1,
    }),
  })
  .openapi("TaskDeleteResponse");
