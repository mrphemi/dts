import {
  integer,
  pgEnum,
  pgTable,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";

export const taskStatusEnum = pgEnum("task_status", ["pending", "completed"]);

export const tasks = pgTable("tasks", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 1024 }),
  status: taskStatusEnum("status").notNull().default("pending"),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
});
