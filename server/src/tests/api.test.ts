import "dotenv/config";

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import { tasks } from "../db/schema.js";
import app from "../index.js";

const client = neon(process.env.TEST_DATABASE_URL!);
const db = drizzle(client);

describe("Task Management API", () => {
  let testTaskId: number;

  beforeAll(async () => {
    await db.delete(tasks);
  });

  afterAll(async () => {
    await db.delete(tasks);
  });

  beforeEach(async () => {
    await db.delete(tasks);
  });

  describe("GET /api/tasks", () => {
    it("should return empty array when no tasks exist", async () => {
      const response = await app.request("/api/tasks");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks).toEqual([]);
    });

    it("should return all tasks when tasks exist", async () => {
      await db.insert(tasks).values([
        {
          title: "Test Task 1",
          description: "First test task",
          status: "pending",
          dueDate: new Date("2024-12-31T23:59:59Z"),
        },
        {
          title: "Test Task 2",
          description: "Second test task",
          status: "completed",
          dueDate: new Date("2024-12-30T10:00:00Z"),
        },
      ]);

      const response = await app.request("/api/tasks");
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.tasks).toHaveLength(2);
      expect(data.tasks[0].title).toBe("Test Task 1");
      expect(data.tasks[1].title).toBe("Test Task 2");
    });
  });

  describe("GET /api/tasks/:id", () => {
    beforeEach(async () => {
      const result = await db
        .insert(tasks)
        .values({
          title: "Test Task for ID",
          description: "Task for testing by ID",
          status: "pending",
          dueDate: new Date("2024-12-31T23:59:59Z"),
        })
        .returning();

      testTaskId = result[0].id;
    });

    it("should return task when valid ID is provided", async () => {
      const response = await app.request(`/api/tasks/${testTaskId}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.task.id).toBe(testTaskId);
      expect(data.task.title).toBe("Test Task for ID");
      expect(data.task.status).toBe("pending");
    });

    it("should return 404 when task does not exist", async () => {
      const response = await app.request("/api/tasks/999999");
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Task not found");
    });

    it("should return 400 when ID is not a number", async () => {
      const response = await app.request("/api/tasks/invalid");
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Error: Invalid Request");
    });
  });

  describe("POST /api/tasks", () => {
    it("should create task", async () => {
      const newTask = {
        title: "New Test Task",
        description: "This is a new test task",
        status: "pending",
        dueDate: "2024-12-31T23:59:59Z",
      };

      const response = await app.request("/api/tasks", {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: new Headers({ "Content-Type": "application/json" }),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.task.title).toBe(newTask.title);
      expect(data.task.description).toBe(newTask.description);
      expect(data.task.status).toBe(newTask.status);
      expect(data.task.id).toBeDefined();
    });

    // Validation error tests
    it("should return 400 when title is missing", async () => {
      const invalidTask = {
        description: "Task without title",
        status: "pending",
        dueDate: "2024-12-31T23:59:59Z",
      };

      const response = await app.request("/api/tasks", {
        method: "POST",
        body: JSON.stringify(invalidTask),
        headers: new Headers({ "Content-Type": "application/json" }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/tasks/:id", () => {
    beforeEach(async () => {
      const result = await db
        .insert(tasks)
        .values({
          title: "Task to Update",
          description: "Original description",
          status: "pending",
          dueDate: new Date("2024-12-31T23:59:59Z"),
        })
        .returning();
      testTaskId = result[0].id;
    });

    it("should update task status successfully", async () => {
      const updateData = { status: "completed" };
      const response = await app.request(`/api/tasks/${testTaskId}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: new Headers({ "Content-Type": "application/json" }),
      });

      const data = await response.json();
      expect(response.status).toBe(200);
      expect(data.message).toBe("Task status updated successfully");
      expect(data.task).toBe(testTaskId);
    });

    it("should return 404 when updating non-existent task", async () => {
      const updateData = { status: "completed" };
      const response = await app.request("/api/tasks/9999", {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: new Headers({ "Content-Type": "application/json" }),
      });
      const data = await response.json();
      expect(response.status).toBe(404);
      expect(data.error).toBe("Task not found");
    });
  });

  describe("DELETE /api/tasks/:id", () => {
    beforeEach(async () => {
      const result = await db
        .insert(tasks)
        .values({
          title: "Task to Delete",
          description: "This task will be deleted",
          status: "pending",
          dueDate: new Date("2024-12-31T23:59:59Z"),
        })
        .returning();
      testTaskId = result[0].id;
    });

    it("should delete task successfully", async () => {
      const response = await app.request(`/api/tasks/${testTaskId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe("Task deleted successfully");
      expect(data.task).toBe(testTaskId);

      // Verify task is actually deleted
      const checkResponse = await app.request(`/api/tasks/${testTaskId}`);
      expect(checkResponse.status).toBe(404);
    });

    it("should return 404 when deleting non-existent task", async () => {
      const response = await app.request("/api/tasks/9999", {
        method: "DELETE",
      });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toBe("Task not found");
    });
  });
});
