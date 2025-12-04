## ib-analytics

An analytics ingestion backend built with NestJS 11, GraphQL (schema-first), PostgreSQL, Passport.js (JWT strategy) and Docker. It provides authenticated CRUD APIs for managing users and recording website events from multiple properties.

### Stack

- NestJS 11 with Apollo GraphQL driver (schema stored in `src/schema.graphql`)
- Prisma ORM targeting PostgreSQL (see `prisma/schema.prisma`)
- Passport.js + JWT guard + role guard for protecting GraphQL resolvers
- Class-validator for input validation and bcrypt for password hashing
- Dockerfile and docker-compose for running the API alongside Postgres

### Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create an environment file**

   ```bash
   cp env.example .env   # create this file with your secrets
   ```

   Required variables:

   ```
   PORT=3000
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=postgres
   DATABASE_NAME=ib_analytics
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ib_analytics?schema=public
   JWT_SECRET=change-me
   JWT_EXPIRES_IN=3600s
   ```

3. **Run Prisma migrations**

   ```bash
   # create/apply migrations locally (prompts for a name when omitted)
   npm run prisma:migrate
   ```

   To apply already-generated migrations (e.g., in CI/CD), use:

   ```bash
   npm run db:migrate
   ```

4. **Start the API**

   ```bash
   npm run start:dev
   ```

The GraphQL endpoint is exposed at `http://localhost:3000/graphql`. Apollo Explorer is enabled in development (GraphQL Playground plugin is disabled by default in Apollo Server v5).

### Auth flow

- `createUser` mutation allows bootstrapping the first account (defaults to `USER` role unless provided).
- `login` mutation returns `{ accessToken, user }`. Supply the JWT as `Authorization: Bearer <token>` for subsequent requests.
- Guards:
  - `GqlAuthGuard` protects resolver access.
  - `RolesGuard` enforces the `@Roles()` decorator (e.g., only admins can manage other users).

### Database schema

- `users`: firstName, lastName, username, email, password (hashed), role (`ADMIN` or `USER`), avatar, timestamps.
- `events`: host, eventName, url, date (timestamp), properties (stringified JSON), timestamps.
- The full schema lives in `prisma/schema.prisma`.

### GraphQL overview

Key operations found in `src/schema.graphql`:

- Queries: `me`, `users`, `user(id)`, `events(filter)`, `event(id)`
- Mutations: `login`, `createUser`, `updateUser`, `deleteUser`, `createEvent`, `updateEvent`, `deleteEvent`
- Inputs allow filtering events by host/name/date range and managing CRUD payloads for both aggregates.

### Docker

`docker-compose.yml` orchestrates Postgres (`db`) and the API (`api`).

```bash
docker compose up --build
```

Environment variables are passed through to both services. Override anything in your local shell or `.env`.

### Useful npm scripts

| Script                    | Purpose                                        |
|---------------------------|------------------------------------------------|
| `npm run start:dev`       | Start Nest in watch mode                       |
| `npm run build`           | Compile TypeScript to `dist/`                  |
| `npm run start:prod`      | Run the compiled app                           |
| `npm run prisma:migrate`  | Run `prisma migrate dev` (create/apply locally)|
| `npm run prisma:generate` | Regenerate the Prisma client                   |
| `npm run db:migrate`      | Run `prisma migrate deploy` (apply existing)   |
| `npm run db:push`         | Push schema directly to the database           |
| `npm run lint`            | ESLint with auto-fix                           |

### Next steps

- Hook up your websites to send GraphQL mutations with event data.
- Extend the schema with additional analytics dimensions or aggregations as needed.
