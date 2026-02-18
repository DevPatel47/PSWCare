# PSWCare

PSWCares is a full-stack web application that connects Personal Support Workers (PSWs) with clients needing in-home care.

This repository now includes **Week 5 core infrastructure**:
- Backend API skeleton with authentication and role-based authorization
- Mongoose database models for core entities
- Frontend React wireframe routing and protected dashboard layouts
- Implementation-aligned technical documentation under `docs/`

## Tech Stack

- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: MongoDB with Mongoose
- Auth: JWT + bcrypt

## Project Structure

- `backend/` - API server and database models
- `frontend/` - React wireframe application
- `docs/` - architecture and technical documentation

Detailed structure documentation: `docs/project-structure.md`

## Quick Start

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
# update .env values (MONGODB_URI, JWT_SECRET, etc.)
npm run dev
```

Backend default URL: `http://localhost:5000`

### 2) Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend default URL: `http://localhost:5173`

## Week 5 Documentation

- `docs/database-schema.md`
- `docs/authentication-flow.md`
- `docs/api-endpoints.md`
- `docs/project-structure.md`
- `docs/wireframe-structure.md`

## Notes

- Stripe key is environment-driven (`STRIPE_SECRET_KEY`) for test-mode readiness.
- Current frontend login/register are structure-focused wireframes; API integration is planned for next milestone work.
