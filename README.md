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

## Career Roadmap & Certification Tracker

Users explore job roles, see which companies hire for them, follow a staged roadmap (Foundation → Intermediate → Advanced → Job-Ready), upload certificates for admin verification, and get a readiness report with completed / remaining / next steps. Admins manage all content and verify certificates.

> This module requires PostgreSQL. Without a database the rest of the app still runs in mock-data mode, and `/api/career/*` returns `503` with setup instructions. User accounts are stored in the `users` table whenever a database is connected.

### Setup

1. Add to `.env`:
   ```
   DATABASE_URL=postgresql://postgres:<password>@localhost:5432/career_navigator
   ADMIN_EMAIL=you@example.com        # promoted to admin by the seed script
   UPLOAD_DIR=                        # optional; defaults to server/uploads
   ```
2. Create the tables (idempotent – runs `database/schema.sql` then `database/career_schema.sql`):
   ```bash
   npm run db:setup
   ```
3. Start the app and register the account for `ADMIN_EMAIL`.
4. Seed 6 roles, 21 companies, 39 certifications and a full roadmap per role:
   ```bash
   npm run seed:career
   ```
   The seed never deletes or overwrites data: re-running inserts only what is missing and leaves admin-edited roadmaps untouched. Log out and back in after promotion so the admin menu appears.

New dependency: `multer` (server, certificate uploads). No new client dependencies.

### Pages

| Path | Page |
| --- | --- |
| `/career/roles` | Explore roles (search, category / experience / demand filters) |
| `/career/roles/:slug` | Role detail – Overview, Companies, Roadmap (step tracking), Certifications |
| `/career/companies`, `/career/companies/:id` | Companies hiring and their roles |
| `/career/progress` | My Career Progress – readiness, next steps, gap analysis, matching companies |
| `/career/certificates` | My Certificates – upload, preview, download, edit, delete, expiry warnings |
| `/admin/career/*` | Admin: stats, verification queue, roles, roadmap editor, companies, certifications |

### Readiness formula

`readiness = 70% × (completed step hours / total roadmap hours) + 30% × (verified core certifications / core certifications)`

Core certifications are the role's *Highly Valued* and *Recommended* ones. Only admin-verified, unexpired certificates count. See `server/services/careerProgressService.js` for the full rules, including the next-step selection and the company readiness bars.

### API (`/api/career`)

- Public: `GET /roles`, `/roles/:slug`, `/roles/:id/companies`, `/roles/:id/roadmap`, `/roles/:id/certifications`, `/companies`, `/companies/:id`, `/certifications`
- Signed in: `POST|DELETE /target-roles/:roleId` (max 3), `GET /progress`, `GET /progress/:roleId`, `PATCH /progress/:roleId/steps/:stepId`, `POST /certificates` (multipart, field `file`), `GET /certificates/me`, `PUT|DELETE /certificates/:id`, `GET /certificates/:id/file` (owner or admin)
- Admin: CRUD `/admin/roles`, `/admin/companies`, `/admin/certifications`; `PUT /admin/roadmaps/:roleId`; `GET /admin/certificates?status=`; `PATCH /admin/certificates/:id/verify`; `GET /admin/career-stats`

### Security notes

- Uploads: PDF/JPG/PNG/WEBP only, max 5 MB, file signature checked against the declared type, stored under random UUID names outside any static folder and served only through the authenticated file endpoint.
- Users can only read or change their own certificates and progress (other users get `404`). Editing a certificate sends it back to *Pending*.
- Admin routes re-check the role in the database on every request, so promotions and demotions apply immediately.

### Manual testing checklist

- [ ] Register, log in, open **Career Roadmaps**; search "SQL" and filter by category, experience, demand
- [ ] Open a role: all four tabs load; certification filters work; company cards link to company detail
- [ ] Set 3 target roles; a 4th is blocked with a clear message; removing one re-enables the button
- [ ] On the Roadmap tab, mark steps In Progress / Completed; time remaining and stage bars update; reload keeps the status
- [ ] **My Career Progress** shows readiness, the three sections, next steps (in-progress step first, plus a Highly Valued certification), the skills checklist and matching companies
- [ ] Upload a certificate: empty form shows field errors; a `.txt` file or a 6 MB file is rejected; a valid PDF uploads as *Pending*
- [ ] Upload one expiring within 30 days → *Expiring Soon* banner; an expired one → *Expired*
- [ ] Preview, download, edit (returns to *Pending*), and delete (with confirmation)
- [ ] As admin: approve one certificate (readiness increases), reject one without a remark (blocked) and with a remark (user sees it)
- [ ] Admin roadmap editor: reorder stages, move a step between stages, save; the user's completed steps are preserved
- [ ] Admin CRUD for roles, companies and certifications, including validation errors and delete confirmation
- [ ] A non-admin visiting `/admin/career` is redirected and does not see the **Career Admin** menu
- [ ] Check every page at phone width (≈390px): no horizontal scrolling
