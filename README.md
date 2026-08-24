# Task/Notes API



A REST API for managing tasks and notes with JWT authentication, ownership-based
authorization, and many-to-many tagging. Built as a baseline backend-competency
project — the focus is on doing every unglamorous piece correctly: auth, validation,
testing, and deployment.

**Live demo:** `https://task-api-u2y3.onrender.com`

---

## Features

- Signup/login with bcrypt-hashed passwords and JWT issuance
- Auth middleware that protects routes and attaches the current user
- Full task CRUD with pagination and filtering by status/tag
- Ownership enforcement — a user can only read/edit/delete their own tasks
- Many-to-many tagging (attach/detach tags on a task) via an explicit join table
- Centralized error handling with consistent JSON error responses
- Request validation on every route (zod)
- Automated tests covering auth, CRUD, and ownership (Jest + Supertest)
- Dockerized

## Tech Stack

| Layer | Choice |
|---|---|
| Runtime | Node.js 18+ |
| Framework | Express |
| Database | PostgreSQL |
| ORM | Prisma 7 |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | zod |
| Testing | Jest + Supertest |
| Containerization | Docker + docker-compose |

## Project Structure

```
src/
  config/       # Prisma client
  controllers/  # Route handlers
  middleware/   # auth guard, validation, error handler
  routes/       # Express routers
  schemas/      # zod validation schemas
  utils/        # AppError, JWT helpers
  app.js
  server.js
prisma/
  schema.prisma
  migrations/
tests/
  auth.test.js
  task.test.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL running locally (see setup notes below) or via Docker

### Setup
```bash
git clone https://github.com/<your-username>/task-notes-api.git
cd task-notes-api
npm install
cp .env.example .env   # then fill in real values
npx prisma migrate dev
npm run dev
```

Verify it's running:
```bash
curl http://localhost:3000/health
```

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | Postgres connection string | `postgresql://postgres:pass@localhost:5432/taskdb` |
| `JWT_SECRET` | Secret used to sign JWTs | a long random string |
| `PORT` | Port the server listens on | `3000` |

## API Overview

Full request/response examples: [`API.md`](./API.md).

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Create account |
| POST | `/api/auth/login` | No | Log in, receive a JWT |
| POST | `/api/tasks` | Yes | Create task |
| GET | `/api/tasks` | Yes | List tasks (pagination, `status`/`tag` filters) |
| GET | `/api/tasks/:id` | Yes | Get one task (owner only) |
| PATCH | `/api/tasks/:id` | Yes | Update task (owner only) |
| DELETE | `/api/tasks/:id` | Yes | Delete task (owner only) |
| POST | `/api/tasks/:id/tags` | Yes | Attach a tag |
| DELETE | `/api/tasks/:id/tags/:tagId` | Yes | Detach a tag |

## Testing

```bash
# create a separate taskdb_test database, then:
npx prisma migrate deploy   # against DATABASE_URL in .env.test
npm test
```
Tests cover the auth flow (signup/login/wrong password), task CRUD, and the ownership check (user A cannot read/edit/delete user B's task).

## Docker

```bash
docker compose up --build
docker compose exec api npx prisma migrate deploy
```

## Design Notes

The database schema (`User`, `Task`, `Tag`, `TaskTag`) and the reasoning behind the many-to-many join table are documented in [`schema-design.md`](./schema-design.md).

