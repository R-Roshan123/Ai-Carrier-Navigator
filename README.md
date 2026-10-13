# AI Career Navigator

A full-stack AI-powered career guidance platform for students and job seekers.

## Overview

The application combines personalized career assessment, skill gap analysis, learning roadmap generation, resume feedback, job matching, and career readiness insights in a polished SaaS dashboard.

## Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: JWT + bcrypt
- AI: Modular service layer with graceful fallback behavior

## Folder Structure

- `client/` — React frontend
- `server/` — Express API and business logic
- `database/` — SQL scripts and schema setup
- `.env.example` — environment template

## Installation

1. Install root dependencies
   ```bash
   npm install
   ```
2. Install frontend dependencies
   ```bash
   cd client && npm install
   ```
3. Copy `.env.example` to `.env` and fill in values.
4. Start PostgreSQL and create the database.
5. Run the app
   ```bash
   npm run dev
   ```

## Environment Variables

- `PORT` — API port
- `CLIENT_URL` — frontend URL
- `JWT_SECRET` — JWT signing secret
- `DATABASE_URL` — PostgreSQL connection string
- `OPENAI_API_KEY` — AI provider key
- `NODE_ENV` — application environment

## Database Setup

```sql
CREATE DATABASE career_navigator;
```

Then run the SQL scripts inside `database/` once ready.

To add repeatable demo data, after applying `database/schema.sql`, run:

```bash
npm run db:seed
```

This creates five linked demo records in every table. All seeded users use the password `DemoPass123!`.

## Running the App

Backend:
```bash
npm run server
```

Frontend:
```bash
cd client && npm run dev
```

## Features

- Career assessment and recommendations
- Skill gap analysis
- Personalized roadmap
- Course and project recommendations
- Resume analysis and builder
- Job matching and application tracking
- AI mentor chatbot
- Dashboard metrics and analytics

## Future Improvements

- Real PostgreSQL schema migrations
- Real OpenAI/LLM provider integration
- File upload resume parsing with document extraction
- Advanced notifications and scheduler
- User-specific persistence and database-backed profiles
