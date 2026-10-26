# Node Prod API

NestJS backend API with JWT authentication, user management, and PostgreSQL support using TypeORM.

## Tech Stack

- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- Passport JWT
- bcrypt
- class-validator

## Coverage So Far

### Total covered: 9 major items

1. NestJS project setup
2. Database integration with TypeORM
3. User module and CRUD service/controller
4. User registration endpoint
5. User login endpoint
6. JWT token generation
7. JWT guard and protected user routes
8. Centralized password hashing in service layer
9. Password excluded from user API responses
10. Added Swagger API docs

## Implemented Endpoints

### Auth

- `POST /auth/register`
- `POST /auth/login`

### Users

- `GET /users`
- `GET /users/:id`
- `POST /users`
- `PATCH /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`

## Current Auth Flow

### Register

- Checks whether email already exists
- Creates a new user
- Hashes password before saving
- Returns JWT token after registration

### Login

- Verifies email exists
- Compares password using bcrypt
- Returns JWT token on success

### Protected Routes

- `/users` endpoints are protected by `JwtAuthGuard`
- Token must be sent as:

```http
Authorization: Bearer <token>
```

## Important Fixes Completed

- Fixed JWT payload mismatch between token and strategy
- Changed duplicate email handling to `ConflictException`
- Removed duplicate password hashing from controller
- Moved password hashing into `UsersService`

## Pending Work

These are still not fully covered:

1. Add `GET /auth/me`
3. Add real unit tests and e2e tests
4. Improve validation and response consistency
5. Use stronger environment configuration practices

## Environment Notes

The project currently uses:

- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `PORT`

## Setup

```bash
npm install
```

## Run

```bash
npm run start:dev
```

## Build

```bash
npm run build
```

## Tests

```bash
npm run test
npm run test:e2e
```

## Current Status Summary

Your project is in a good working state for basic authentication and protected CRUD operations.

The next recommended step is adding `GET /auth/me` so a logged-in user can fetch their own profile from the token.
