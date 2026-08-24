# API Reference

Base URL: `http://localhost:3000/api` (or your deployed URL). All request/response
bodies are JSON. Protected routes require `Authorization: Bearer <token>`.

---

## Auth

### POST /auth/signup
**Auth:** No
**Body:**
```json
{ "email": "you@example.com", "password": "password123" }
```
**201 Response:**
```json
{
  "user": { "id": 1, "email": "you@example.com", "createdAt": "2026-01-01T00:00:00.000Z" },
  "token": "<jwt>"
}
```
**Errors:** `400` validation error, `409` email already in use

### POST /auth/login
**Auth:** No
**Body:**
```json
{ "email": "you@example.com", "password": "password123" }
```
**200 Response:**
```json
{ "user": { "id": 1, "email": "you@example.com" }, "token": "<jwt>" }
```
**Errors:** `400` validation error, `401` invalid credentials

---

## Tasks

### POST /tasks
**Auth:** Yes
**Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "status": "todo",
  "dueDate": "2026-01-15T00:00:00.000Z"
}
```
Only `title` is required.
**201 Response:** the created task object.

### GET /tasks
**Auth:** Yes
**Query params:** `page` (default 1), `limit` (default 10, max 100), `status` (`todo`/`in_progress`/`done`), `tag` (tag name)
**200 Response:**
```json
{
  "data": [ { "id": 1, "title": "Buy groceries", "status": "todo", "tags": [] } ],
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1
}
```

### GET /tasks/:id
**Auth:** Yes (must own the task)
**200 Response:** the task object.
**Errors:** `404` not found, `403` not the owner

### PATCH /tasks/:id
**Auth:** Yes (must own the task)
**Body:** any subset of the create fields.
**200 Response:** the updated task.
**Errors:** `404`, `403`, `400` validation error

### DELETE /tasks/:id
**Auth:** Yes (must own the task)
**204 Response:** empty body.
**Errors:** `404`, `403`

---

## Tags

### POST /tasks/:id/tags
**Auth:** Yes (must own the task)
**Body:**
```json
{ "name": "personal" }
```
Creates the tag if it doesn't exist yet; attaching an already-attached tag is safe (no duplicate error).
**201 Response:**
```json
{ "id": 3, "name": "personal" }
```
**Errors:** `404` task not found, `403` not the owner, `400` validation error

### DELETE /tasks/:id/tags/:tagId
**Auth:** Yes (must own the task)
**204 Response:** empty body.
**Errors:** `404`, `403`

---


## Error Shape

All errors, from any route, return:
```json
{ "error": "message describing what went wrong" }
```
Validation errors additionally include field-level detail:
```json
{ "error": "ValidationError", "details": { "email": ["Invalid email"] } }
```