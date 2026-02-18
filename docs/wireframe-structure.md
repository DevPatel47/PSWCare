# PSWCares Wireframe Structure (Week 5)

## Objective

Create minimal React layout and route flow to validate user journey before detailed UI implementation.

---

## Implemented Pages

- `LoginPage`
- `RegisterPage`
- `ClientDashboardPage`
- `PswDashboardPage`
- `AdminDashboardPage`

All are structure-first, with simple placeholders and form controls.

---

## Layout and Navigation

- `MainLayout` wraps all routes
- `Navigation` provides links to auth and dashboard routes
- Auth state uses `AuthProvider` in `useAuth` hook

---

## Routing Flow

Public routes:
- `/login`
- `/register`

Protected routes:
- `/dashboard/client` (Client role)
- `/dashboard/psw` (PSW role)
- `/dashboard/admin` (Admin role)

Default behavior:
- `/` redirects to `/login`
- Unknown routes redirect to `/login`

---

## Protected Route Behavior

`ProtectedRoute` checks:
1. User is authenticated (token present in auth context)
2. User role exists in `allowedRoles`

Outcomes:
- Not authenticated → redirect to `/login`
- Role mismatch → redirect to `/login`
- Valid auth + role → render requested dashboard page

---

## Architecture Decisions

- Wireframe uses local auth simulation in login page to demonstrate role-based flow without API dependency.
- This enables frontend route/protection testing in Week 5 while backend integration is completed in Week 6.

---

## Assumptions and Limitations

- No production styling or responsive polish in this phase
- No API call integration yet on login/register forms
- Role simulation in login page is temporary and will be replaced with backend auth response usage
