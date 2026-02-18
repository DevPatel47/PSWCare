# PSWCares Authentication Flow (Week 5)

## Overview

Authentication uses:
- `bcrypt` for password hashing
- `JWT` for stateless session tokens
- Role-based middleware for authorization (`PSW`, `Client`, `Admin`)

Folder responsibility:
- `services/authService.js`: business logic
- `controllers/authController.js`: request/response handling
- `middleware/authMiddleware.js`: token verification
- `middleware/roleMiddleware.js`: role access control

---

## Registration Flow

Endpoint: `POST /api/auth/register`

Steps:
1. Controller validates required fields (`name`, `email`, `password`, `role`)
2. Service allows only `PSW` and `Client` for self-registration
3. Duplicate email check is performed
4. Password is hashed using `bcrypt.hash(password, 10)`
5. User is stored and safe user object is returned

Response status:
- `201 Created` on success
- `400 Bad Request` for validation failures
- `409 Conflict` for duplicate email

---

## Login Flow

Endpoint: `POST /api/auth/login`

Steps:
1. Controller validates `email` and `password`
2. Service fetches user including hidden password field
3. Password is verified using `bcrypt.compare`
4. JWT token is created with payload `{ userId, role }`
5. Response returns token and user profile data

Response status:
- `200 OK` on success
- `401 Unauthorized` for invalid credentials

---

## Authorization Flow

### 1) `protect` middleware
- Reads `Authorization: Bearer <token>`
- Verifies token with `JWT_SECRET`
- Loads user from DB and attaches `req.user`

### 2) `allowRoles(...roles)` middleware
- Checks `req.user.role`
- Returns `403 Forbidden` if role is not in allowed list

---

## Example Protected Routes

- `GET /api/protected/client` → Client only
- `GET /api/protected/psw` → PSW only
- `GET /api/protected/admin` → Admin only

---

## Error Handling

Centralized middleware handles:
- Not found routes (`404`)
- Operational and validation errors (`4xx`)
- Unexpected server errors (`500`)

Response format:

```json
{
  "success": false,
  "message": "Readable error message"
}
```

---

## Environment Variables

Required backend `.env` values:
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `STRIPE_SECRET_KEY` (for test mode readiness)

No secrets are hardcoded in source files.

---

## Assumptions and Limitations

- Admin signup is intentionally blocked in public register endpoint.
- Refresh token and logout token blacklisting are out of Week 5 scope.
- Field-level request validation library (e.g., Joi/Zod) is not included yet to keep MVP simple.
