# Schema Design


## Entities

| Entity | Purpose |
|---|---|
| `User` | An account holder. Owns tasks. |
| `Task` | A to-do/note item belonging to exactly one user. |
| `Tag` | A label that can be applied to any number of tasks. |
| `TaskTag` | Join table implementing the many-to-many between Task and Tag. |


## Relationships & Cardinality

- **User → Task, 1:N.** One user owns many tasks; a task belongs to exactly one user.
- **Task ↔ Tag, N:M.** A task can carry multiple tags, and a tag can apply to multiple
  tasks. Modeled with an explicit join table (`TaskTag`) rather than Prisma's implicit
  many-to-many, so the relationship maps directly to real SQL and can be extended later


## Key Decisions

| Decision | Rationale |
|---|---|
| `email` marked `@unique` | Required for `findUnique({ where: { email } })` in login/signup. |
| `status` as a Prisma `enum`, not a free-text string | Prevents invalid states from ever reaching the database. |
| `status` defaults to `todo` | Matches the natural lifecycle — a task is created before it's started. |
| `description` and `dueDate` optional (`String?`, `DateTime?`) | Only `title` is required by the problem statement; forcing the others would reject valid minimal task creation. |
| `TaskTag` composite primary key `(taskId, tagId)` | A given tag can only be attached to a given task once — the composite key enforces that at the DB level. |
| `onDelete: Cascade` on all relations | Deleting a user deletes their tasks; deleting a task deletes its `TaskTag` rows.  |
| `createdAt` / `updatedAt` on `Task` | Standard audit fields; `updatedAt` uses Prisma's `@updatedAt` so it's maintained automatically. |

## Constraints 

- `User.email` — required, unique
- `User.passwordHash` — required (never store the plaintext password)
- `Task.title` — required
- `Task.status` — required, one of `todo` / `in_progress` / `done`, defaults to `todo`
- `Tag.name` — required, unique


## Final Schema

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  tasks        Task[]
}

enum TaskStatus {
  todo
  in_progress
  done
}

model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus @default(todo)
  dueDate     DateTime?
  userId      Int
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  tags        TaskTag[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Tag {
  id    Int       @id @default(autoincrement())
  name  String    @unique
  tasks TaskTag[]
}

model TaskTag {
  taskId Int
  tagId  Int
  task   Task @relation(fields: [taskId], references: [id], onDelete: Cascade)
  tag    Tag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([taskId, tagId])
}
```
