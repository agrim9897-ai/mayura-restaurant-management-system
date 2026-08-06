# Mayura Restaurant — Backend API

Production-ready REST API for the Mayura Restaurant website.

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Auth:** JWT + bcrypt

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL running locally
- A database named `mayura_db`

### Installation

```bash
cd backend
npm install
```

### Environment Setup

```bash
# Copy the example and fill in your values
cp .env.example .env
```

Update `DATABASE_URL` in `.env` to match your PostgreSQL credentials.

### Generate Prisma Client

```bash
npm run prisma:generate
```

### Start Development Server

```bash
npm run dev
```

The server starts at `http://localhost:5000`.

### Health Check

```
GET http://localhost:5000/api/health
```

## Project Structure

```
backend/
├── prisma/                  # Prisma ORM schema and migrations
│   └── schema.prisma        # Database schema definition
│
├── src/
│   ├── config/              # App configuration and database setup
│   │   ├── index.js          # Centralized environment config
│   │   └── database.js       # Prisma client singleton
│   │
│   ├── controllers/         # Request handlers (thin layer)
│   ├── middleware/           # Express middleware (error handling, auth, etc.)
│   ├── models/              # Data access helpers (if needed beyond Prisma)
│   ├── routes/              # Route definitions (one file per resource)
│   ├── services/            # Business logic layer
│   ├── validators/          # Request validation schemas (Zod)
│   ├── utils/               # Shared utilities (ApiError, ApiResponse, etc.)
│   │
│   ├── app.js               # Express app setup and middleware registration
│   └── server.js            # Server entry point and graceful shutdown
│
├── .env.example             # Environment variable template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Available Scripts

| Script              | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start dev server with hot reload     |
| `npm start`         | Start production server              |
| `npm run prisma:generate` | Generate Prisma client          |
| `npm run prisma:migrate`  | Run database migrations          |
| `npm run prisma:studio`   | Open Prisma Studio (DB browser)  |
