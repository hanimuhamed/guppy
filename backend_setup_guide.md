# GetSetPixel Backend Setup Guide

This document explains how to run the production backend service for GetSetPixel locally. The backend replaces the mock API previously used in the frontend and is backed by a PostgreSQL database.

## Prerequisites

1. **Node.js**: Make sure you have Node (v18+) installed.
2. **Docker**: You will need Docker (or Docker Desktop) installed to run the PostgreSQL database locally without manual installation.

## Step 1: Start the PostgreSQL Database

Open a terminal and navigate to the `backend` directory. We have provided a `docker-compose.yml` to spin up PostgreSQL instantly.

```bash
cd backend
docker compose up -d
```
*(The `-d` flag runs the container in the background).*

## Step 2: Set Up the Database Schema

With Postgres running, you need to push the Prisma schema to the database and generate the Prisma Client. Stay in the `backend` directory:

```bash
npm run db:push
npm run db:generate
```

## Step 3: Run the Backend Server

To start the backend in development mode (which automatically restarts on file changes):

```bash
npm run dev
```

You should see: `Server listening on port 8080`.

## Step 4: Run the Frontend

In a separate terminal, navigate to the `frontend` directory and start the Vite dev server as usual:

```bash
cd frontend
npm run dev
```

The frontend will now automatically communicate with `http://localhost:8080/api` to persist users and gameplay progress to your new PostgreSQL database!

---
## Troubleshooting

**Cannot connect to database:**
Make sure Docker is running and the container started successfully. You can check container status by running `docker ps`.

**Port 8080 is in use:**
If you have another service running on port 8080, you can change the backend port by modifying the `PORT` fallback in `backend/src/index.ts` and updating `API_BASE_URL` in `frontend/src/api/client.ts`.
