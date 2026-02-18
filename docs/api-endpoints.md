# PSWCares API Endpoints (Week 5)

Base URL (local): `http://localhost:5000`

## Response Pattern

Success:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## Health

### GET `/api/health`
Checks API availability.

Sample response:

```json
{
  "success": true,
  "message": "PSWCares API is running"
}
```

---

## Auth

### POST `/api/auth/register`

Request body:

```json
{
  "name": "Ayesha Khan",
  "email": "ayesha@example.com",
  "password": "StrongPass123",
  "role": "Client"
}
```

Sample success (`201`):

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "65f4...",
    "name": "Ayesha Khan",
    "email": "ayesha@example.com",
    "role": "Client",
    "isApproved": true
  }
}
```

Validation notes:
- `role` must be `PSW` or `Client` for public registration.
- Password minimum length is 8.

---

### POST `/api/auth/login`

Request body:

```json
{
  "email": "ayesha@example.com",
  "password": "StrongPass123"
}
```

Sample success (`200`):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt-token-value",
    "user": {
      "id": "65f4...",
      "name": "Ayesha Khan",
      "email": "ayesha@example.com",
      "role": "Client",
      "isApproved": true
    }
  }
}
```

---

## Role-Protected Examples

All protected endpoints require:

`Authorization: Bearer <JWT_TOKEN>`

### GET `/api/protected/client`
- Allowed role: `Client`

### GET `/api/protected/psw`
- Allowed role: `PSW`

### GET `/api/protected/admin`
- Allowed role: `Admin`

Unauthorized cases:
- Missing token → `401`
- Invalid token → `401`
- Wrong role → `403`

---

## Assumptions and Limitations

- Endpoint set is Week 5 only.
- Feature endpoints for booking, payment processing, chat, and reviews are planned in later weeks.
