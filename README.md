# Task Management Application

A full-stack task management application with a RESTful API backend and a React frontend. Create, manage, and track your tasks with an intuitive interface and comprehensive API documentation.

[**Live URL**](https://dts-production.up.railway.app/)

## 🚀 Technologies Used

### Backend

- [**Hono**](https://hono.dev/) - Ultra-fast web framework
- [**Zod**](https://zod.dev/) - TypeScript-first schema validation
- [**@hono/zod-openapi**](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) - OpenAPI integration with Zod validation
- [**@hono/swagger-ui**](https://github.com/honojs/middleware/tree/main/packages/swagger-ui) - Interactive API documentation

### Database and ORM

- [**PostgreSQL**](https://www.postgresql.org/) - Relational database
- [**Neon**](https://neon.tech/) - Serverless Postgres platform
- [**Drizzle ORM**](https://orm.drizzle.team/) - TypeScript ORM for SQL databases

### Frontend

- [**React**](https://react.dev/) - UI library
- [**TypeScript**](https://www.typescriptlang.org/) - Type-safe JavaScript
- [**Vite**](https://vitejs.dev/) - Fast build tool and dev server
- [**TanStack Query**](https://tanstack.com/query) - Powerful data fetching and caching
- [**Tailwind CSS**](https://tailwindcss.com/) - Utility-first CSS framework

### Package Manager

- [**Bun**](https://bun.com/package-manager) - Bun package manager.
  You can substitute bun for npm, yarn etc.

### Testing

- [**Vitest**](https://vitest.dev/) - Fast unit testing framework

## 📋 Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as completed or pending
- ✅ Set due dates for tasks
- ✅ Interactive API documentation with Swagger UI
- ✅ Type-safe API with Zod validation
- ✅ Responsive React frontend
- ✅ Real-time data synchronization
- ✅ Comprehensive test coverage

## 🛠️ Prerequisites

Before running this project, make sure you have:

- [**Bun**](https://bun.sh/) (v1.0 or higher) - [Install Instructions](https://bun.sh/docs/installation)
- **PostgreSQL** database or [Neon](https://neon.tech/) account or any flavour of **PostgreSQL**

## 🏃 Running Locally

### 1. Clone the Repository

```
git clone <repository-url>
cd task-management-app
```

### 2. Install Dependencies

```
# Install backend dependencies
bun install

# Install frontend dependencies
cd frontend
bun install
```

### 3. Environment Variables

Create a .env file in the **root directory** with the following variables:

```
# Database Configuration
DATABASE_URL=<postgresdb-url>

# Test Database (Optional)
TEST_DATABASE_URL=<postgresdb-url>
```

### 4. Set Up Database Schema

Run the database migrations to create tables:

```
# Generate migration files (if using Drizzle Kit)
bunx drizzle-kit generate

# Push schema to database
bunx drizzle-kit push
```

### 5. Build the Frontend

```
# Generate migration files (if using Drizzle Kit)
cd frontend
bun run build
```

### 6. Start the Development Server

Option 1: Run Everything (Recommended)

```
# Start backend server (serves both API and frontend)
bun run dev
```

The application will be available at:

- [Frontend & API:](http://localhost:3000)
- [API Documentation:](http://localhost:3000/docs)
- [OpenAPI Spec](http://localhost:3000/api/doc)

Option 2: Separate Frontend & Backend (Development)

Terminal 1 - Backend:

```
bun run dev
```

Terminal 2 - Frontend:

```
cd frontend
bun run dev
```

This will run:

- [Backend API:](http://localhost:3000)
- [Frontend Dev:](http://localhost:5173)

### 7. Run Tests

```
# Run all tests
bun run test
```
