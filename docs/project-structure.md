# PSWCares Project Structure (Week 5)

## Root Layout

```text
PSWCare/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  ├─ services/
│  │  ├─ utils/
│  │  ├─ app.js
│  │  └─ server.js
│  ├─ .env.example
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ components/
│  │  ├─ hooks/
│  │  ├─ layouts/
│  │  ├─ pages/
│  │  ├─ App.jsx
│  │  └─ main.jsx
│  ├─ index.html
│  ├─ vite.config.js
│  └─ package.json
└─ docs/
   ├─ api-endpoints.md
   ├─ authentication-flow.md
   ├─ database-schema.md
   ├─ project-structure.md
   └─ wireframe-structure.md
```

---

## Backend Folder Purpose

- `models/`: Mongoose schemas and collection design
- `routes/`: Route registration and endpoint grouping
- `controllers/`: HTTP handling layer (validation + responses)
- `middleware/`: Auth, role checks, and error middleware
- `services/`: Business logic and data operation orchestration
- `utils/`: Shared helpers (`AppError`, async wrapper, JWT helper)

---

## Frontend Folder Purpose

- `components/`: Reusable UI units (navigation, protected route)
- `pages/`: Page-level route components
- `layouts/`: Shared screen layout wrappers
- `hooks/`: Reusable state logic (`useAuth` context)

---

## Architecture Decisions

- Clear separation of concerns to support future scaling
- Service layer used in backend auth flow to avoid fat controllers
- Minimal React wireframe implementation for navigation and route protection without UI complexity
- Environment-driven configuration to avoid hardcoded secrets

---

## Assumptions and Limitations

- Monorepo-style root with independent backend/frontend package management
- No Docker or CI pipeline included in Week 5 scope
- Styling framework intentionally omitted to keep wireframe structure-focused
