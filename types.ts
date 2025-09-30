import { z } from "zod";

// Enum schema for task status
export const TaskStatusSchema = z.enum(["pending", "completed"]);

// Schema for validating task ID in params
export const ParamsSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, "ID must be a number")
    .transform((val) => parseInt(val)),
});

// Schema for creating a new task
export const CreateTaskSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").max(200, "Title too long"),
  description: z
    .string()
    .max(1000, "Description too long")
    .optional()
    .nullable(),
  status: TaskStatusSchema,
  dueDate: z.coerce.date(),
});

export type Task = z.infer<typeof CreateTaskSchema>;

export type TaskWithID = Task & {
  id: number;
};

export const UpdateTaskSchema = z.object({
  status: TaskStatusSchema,
});
