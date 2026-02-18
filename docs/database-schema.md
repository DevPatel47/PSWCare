# PSWCares Database Schema (Week 5)

## Overview

This document defines the MVP MongoDB schema using Mongoose for Week 5 core infrastructure.

Design goals:
- Keep schemas minimal and readable for academic capstone scope
- Use clear references between collections
- Use enums for controlled status/role values
- Apply validation and timestamps consistently

---

## Collections

## 1) User

Purpose: Authentication identity and role ownership.

Key fields:
- `name` (String, required, 2–80 chars)
- `email` (String, required, unique, lowercase, regex validated)
- `password` (String, required, min 8, excluded by default)
- `role` (Enum: `PSW | Client | Admin`)
- `isApproved` (Boolean, default `false`)
- `createdAt`, `updatedAt` (timestamps)

Notes:
- Self-registration currently allows only `PSW` and `Client`.
- `Admin` accounts should be created by seed/admin workflows.

---

## 2) PSWProfile

Purpose: Extended profile data for a PSW user.

Key fields:
- `user` (ObjectId ref `User`, required, unique)
- `bio` (String, max 500)
- `hourlyRate` (Number, required, min 0)
- `yearsOfExperience` (Number, default 0, range 0–60)
- `serviceAreas` (String[])
- `skills` (String[])
- `approvalStatus` (Enum: `Pending | Approved | Rejected`)
- timestamps

Relationship:
- One-to-one with `User` where `User.role = PSW`.

---

## 3) Appointment

Purpose: Booking record between a client and PSW.

Key fields:
- `client` (ObjectId ref `User`, required)
- `psw` (ObjectId ref `User`, required)
- `date` (Date, required)
- `durationHours` (Number, required, range 1–24)
- `address` (String, required, max 200)
- `status` (Enum: `Pending | Confirmed | InProgress | Completed | Cancelled`)
- `notes` (String, max 500)
- timestamps

Relationship:
- Many appointments per user.

---

## 4) Payment

Purpose: Track payment lifecycle for an appointment (Stripe test mode ready).

Key fields:
- `appointment` (ObjectId ref `Appointment`, required, unique)
- `client` (ObjectId ref `User`, required)
- `psw` (ObjectId ref `User`, required)
- `amount` (Number, required, min 0)
- `currency` (String, default `cad`)
- `stripePaymentIntentId` (String, required)
- `status` (Enum: `Pending | Succeeded | Failed | Refunded`)
- timestamps

Notes:
- `STRIPE_SECRET_KEY` is configured via environment file.
- Actual Stripe SDK workflow is planned for Week 7.

---

## 5) Message

Purpose: Persist chat messages for an appointment context.

Key fields:
- `appointment` (ObjectId ref `Appointment`, required)
- `sender` (ObjectId ref `User`, required)
- `receiver` (ObjectId ref `User`, required)
- `body` (String, required, max 1000)
- `status` (Enum: `Sent | Delivered | Read`)
- timestamps

---

## 6) Review

Purpose: Client feedback for completed appointment.

Key fields:
- `appointment` (ObjectId ref `Appointment`, required, unique)
- `client` (ObjectId ref `User`, required)
- `psw` (ObjectId ref `User`, required)
- `rating` (Number, required, range 1–5)
- `comment` (String, max 600)
- timestamps

Notes:
- Business rule “only completed appointments can be reviewed” is enforced in service logic in later milestones.

---

## Assumptions and Limitations

- Week 5 focuses on schema correctness and structure, not advanced indexing strategy.
- Domain constraints that require cross-collection checks are deferred to service-layer business logic.
- Payment schema is test-mode ready but not fully integrated with Stripe API yet.
