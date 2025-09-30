import "dotenv/config";

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serveStatic } from "@hono/node-server/serve-static";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Hook } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { tasks } from "./db/schema.js";
import {
  getAllTasksRoute,
  getTaskByIdRoute,
  createTaskRoute,
  deleteTaskRoute,
  updateTaskRoute,
} from "./routes/index.js";

// custom validation hook
const defaultHook: Hook<any, any, any, any> = (result, c) => {
  if (!result.success) {
    return c.json(
      {
        message: "Error: Invalid Request",
        error: JSON.parse(result.error.message),
      },
      400
    );
  }
};

const app = new OpenAPIHono({
  defaultHook,
});

const api = new OpenAPIHono({
  defaultHook,
}).basePath("/api");

api.use("*", cors());
api.use("*", logger());

const client = neon(
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL!
    : process.env.DATABASE_URL!
);
const db = drizzle(client);

// Get All Tasks
api.openapi(getAllTasksRoute, async (c) => {
  try {
    const result = await db.select().from(tasks);
    return c.json({ tasks: result }, 200);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return c.json({ error: "Failed to fetch tasks" }, 500);
  }
});

// Get Task by ID
api.openapi(getTaskByIdRoute, async (c) => {
  const { id } = c.req.valid("param");

  try {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));

    if (result.length === 0) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json({ task: result[0] }, 200);
  } catch (error) {
    console.error("Error fetching task:", error);
    return c.json({ error: "Failed to fetch task" }, 500);
  }
});

// Create Task
api.openapi(createTaskRoute, async (c) => {
  const { title, description, status, dueDate } = c.req.valid("json");

  try {
    const result = await db
      .insert(tasks)
      .values({
        title,
        description,
        status,
        dueDate,
      })
      .returning();

    return c.json({ task: result[0] }, 201);
  } catch (error) {
    console.error("Error creating task:", error);
    return c.json({ error: "Failed to create task" }, 500);
  }
});

// Delete Task
api.openapi(deleteTaskRoute, async (c) => {
  const { id } = c.req.valid("param");

  try {
    const deletedTask = await db
      .delete(tasks)
      .where(eq(tasks.id, id))
      .returning();

    if (deletedTask.length === 0) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json(
      {
        message: "Task deleted successfully",
        task: deletedTask[0].id,
      },
      200
    );
  } catch (error) {
    console.error("Database error:", error);
    return c.json({ error: "Failed to delete task" }, 500);
  }
});

// Update Task Status
api.openapi(updateTaskRoute, async (c) => {
  const { id } = c.req.valid("param");
  const { status } = c.req.valid("json");

  try {
    const updatedTask = await db
      .update(tasks)
      .set({ status })
      .where(eq(tasks.id, id))
      .returning();

    if (updatedTask.length === 0) {
      return c.json({ error: "Task not found" }, 404);
    }

    return c.json(
      {
        message: "Task status updated successfully",
        task: updatedTask[0].id,
      },
      200
    );
  } catch (error) {
    console.error("Database error:", error);
    return c.json({ error: "Failed to update task" }, 500);
  }
});

// OpenAPI documentation endpoint
api.doc("/doc", {
  openapi: "3.0.0",
  info: {
    title: "Task Management API",
    version: "1.0.0",
    description: "A RESTful API for managing tasks with CRUD operations",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
    {
      url: "https://your-domain.com",
      description: "Production server",
    },
  ],
  tags: [
    {
      name: "Tasks",
      description: "Task management endpoints",
    },
  ],
});

app.route("/", api);

// Swagger UI at /docs
app.get(
  "/docs",
  swaggerUI({
    url: "/api/doc",
  })
);

app.use("*", serveStatic({ root: "./frontend/dist" }));
app.use("*", serveStatic({ root: "./frontend/dist/index.html" }));

serve(app, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

export default app;
