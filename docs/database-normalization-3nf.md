# PSWCares Database Normalization (Up to 3NF)

## Purpose

This document provides a formal normalization analysis of the current MVP data model and explains how the schema aligns with Third Normal Form (3NF).

It is written as a companion to [database-schema.md](./database-schema.md), with a focus on:

- Functional dependencies
- Candidate keys and primary keys
- 1NF, 2NF, and 3NF checks
- Controlled denormalization in a MongoDB context

---

## Scope and Context

### Data Model in Scope

The analysis covers these collections:

- `User`
- `PSWProfile`
- `Appointment`
- `Payment`
- `Message`
- `Review`

### Storage Model Note (MongoDB)

Normalization rules were originally defined for relational tables. This project uses MongoDB documents with Mongoose models. The same dependency logic still applies conceptually, but practical design may intentionally mix normalized references with selective denormalization for query efficiency.

This document evaluates the _logical design quality_ using normal form criteria.

---

## Normal Forms Used

### First Normal Form (1NF)

A relation is in 1NF when:

- Each field contains atomic values (no repeating groups in one field)
- Each record is uniquely identifiable

### Second Normal Form (2NF)

A relation is in 2NF when:

- It is already in 1NF
- Every non-key attribute is fully functionally dependent on the entire key

Note: If the key is a single attribute (for example `_id`), partial dependency cannot occur.

### Third Normal Form (3NF)

A relation is in 3NF when:

- It is already in 2NF
- No non-key attribute is transitively dependent on a key through another non-key attribute

Equivalent rule:
For every non-trivial dependency $X \to A$, either:

- $X$ is a superkey, or
- $A$ is a prime attribute (part of a candidate key)

---

## Key Assumptions for Dependency Analysis

1. Every collection has a technical primary key `_id`.
2. Business-unique constraints define alternate candidate keys where present.
3. Enumerated status fields are treated as scalar attributes, not lookup entities, for MVP simplicity.
4. Cross-collection derivations (for example user display fields) are resolved at query/service level and not duplicated into base collections.

---

## Collection-by-Collection 3NF Analysis

## 1) User

### Typical Attributes

- `_id` (PK)
- `name`
- `email` (unique)
- `password`
- `role`
- `isApproved`
- timestamps

### Candidate Keys

- `_id`
- `email` (alternate candidate key because of uniqueness)

### Main Functional Dependencies

- `_id -> name, email, password, role, isApproved, createdAt, updatedAt`
- `email -> _id, name, password, role, isApproved, createdAt, updatedAt`

### Normal Form Check

- 1NF: Satisfied. Fields are atomic in operational use.
- 2NF: Satisfied. Keys are single-attribute; no partial dependencies.
- 3NF: Satisfied. No non-key attribute functionally determines another non-key attribute in the model.

### Notes

- `isApproved` is a direct state attribute of the user account; it does not derive from another non-key in this collection.

---

## 2) PSWProfile

### Typical Attributes

- `_id` (PK)
- `user` (unique reference to `User`)
- `bio`
- `hourlyRate`
- `yearsOfExperience`
- `serviceAreas` (array)
- `skills` (array)
- `approvalStatus`
- timestamps

### Candidate Keys

- `_id`
- `user` (business key due to one-to-one profile constraint)

### Main Functional Dependencies

- `_id -> user, bio, hourlyRate, yearsOfExperience, serviceAreas, skills, approvalStatus, createdAt, updatedAt`
- `user -> _id, bio, hourlyRate, yearsOfExperience, serviceAreas, skills, approvalStatus, createdAt, updatedAt`

### Normal Form Check

- 1NF: Satisfied for scalar fields. Arrays (`serviceAreas`, `skills`) represent multi-valued attributes common in document models.
- 2NF: Satisfied. Single-attribute keys.
- 3NF: Satisfied. No modeled transitive dependencies between non-key attributes.

### Notes

- In strict relational design, skills/service areas could be decomposed into separate child relations. For MongoDB MVP scope, arrays are acceptable and intentionally practical.

---

## 3) Appointment

### Typical Attributes

- `_id` (PK)
- `client` (ref `User`)
- `psw` (ref `User`)
- `date`
- `durationHours`
- `address`
- `status`
- `notes`
- timestamps

### Candidate Keys

- `_id`

### Main Functional Dependencies

- `_id -> client, psw, date, durationHours, address, status, notes, createdAt, updatedAt`

### Normal Form Check

- 1NF: Satisfied. Stored fields are atomic.
- 2NF: Satisfied. Single-attribute primary key.
- 3NF: Satisfied. `status`, `address`, `durationHours`, and `notes` are directly dependent on appointment identity.

### Notes

- Potential derived values such as computed end-time are not stored as independent non-key determinants in this schema version.

---

## 4) Payment

### Typical Attributes

- `_id` (PK)
- `appointment` (unique reference)
- `client` (ref `User`)
- `psw` (ref `User`)
- `amount`
- `currency`
- `stripePaymentIntentId`
- `status`
- timestamps

### Candidate Keys

- `_id`
- `appointment` (alternate key due to uniqueness)
- `stripePaymentIntentId` (effectively unique in payment provider domain; enforce if not already)

### Main Functional Dependencies

- `_id -> appointment, client, psw, amount, currency, stripePaymentIntentId, status, createdAt, updatedAt`
- `appointment -> _id, client, psw, amount, currency, stripePaymentIntentId, status, createdAt, updatedAt`

### Normal Form Check

- 1NF: Satisfied.
- 2NF: Satisfied.
- 3NF: Mostly satisfied with one design caveat described below.

### 3NF Caveat (Controlled Duplication)

`client` and `psw` are inferable via `appointment`. If dependency $appointment \to client, psw$ is guaranteed in all states, then storing both in `Payment` introduces redundancy and a transitive path:

- `_id -> appointment`
- `appointment -> client, psw`

That can be interpreted as a 3NF risk in strict relational terms.

### Why This Can Be Acceptable Here

- Duplicate party references in payments are often kept for audit readability and query simplicity.
- Financial records benefit from snapshot-like stability even if linked entities later evolve.

### Recommendation

Choose one explicit policy:

1. **Strict 3NF policy:** keep only `appointment` and derive `client`/`psw` by join/populate.
2. **Audit snapshot policy (current practical style):** keep `client`/`psw` with service-layer consistency checks.

---

## 5) Message

### Typical Attributes

- `_id` (PK)
- `appointment` (ref)
- `sender` (ref `User`)
- `receiver` (ref `User`)
- `body`
- `status`
- timestamps

### Candidate Keys

- `_id`

### Main Functional Dependencies

- `_id -> appointment, sender, receiver, body, status, createdAt, updatedAt`

### Normal Form Check

- 1NF: Satisfied.
- 2NF: Satisfied.
- 3NF: Satisfied.

### Notes

- `sender` and `receiver` are intrinsic to each message event and are not transitively derived from another non-key field in the record.

---

## 6) Review

### Typical Attributes

- `_id` (PK)
- `appointment` (unique reference)
- `client` (ref `User`)
- `psw` (ref `User`)
- `rating`
- `comment`
- timestamps

### Candidate Keys

- `_id`
- `appointment` (alternate key due to one-review-per-appointment rule)

### Main Functional Dependencies

- `_id -> appointment, client, psw, rating, comment, createdAt, updatedAt`
- `appointment -> _id, client, psw, rating, comment, createdAt, updatedAt`

### Normal Form Check

- 1NF: Satisfied.
- 2NF: Satisfied.
- 3NF: Mostly satisfied with caveat similar to `Payment`.

### 3NF Caveat (Controlled Duplication)

If `appointment` determines participating `client` and `psw`, then storing them again in `Review` is redundant and can create update anomalies unless controlled.

### Recommendation

- If strict normalization is required for grading: store only `appointment`, `rating`, `comment` and derive participants.
- If traceability/read performance is prioritized: keep duplicate refs and validate consistency in service layer.

---

## Summary Matrix

| Collection  | 1NF | 2NF | 3NF         | Notes                                                         |
| ----------- | --- | --- | ----------- | ------------------------------------------------------------- |
| User        | Yes | Yes | Yes         | Clean candidate key on `email`                                |
| PSWProfile  | Yes | Yes | Yes         | Arrays are practical MongoDB choice                           |
| Appointment | Yes | Yes | Yes         | No transitive dependency in base fields                       |
| Payment     | Yes | Yes | Conditional | `client`/`psw` may be transitively derived from `appointment` |
| Message     | Yes | Yes | Yes         | Event-style record is normalization-friendly                  |
| Review      | Yes | Yes | Conditional | Same caveat as `Payment`                                      |

---

## Final Conclusion

The schema is generally normalized to 3NF for core identity and booking entities.

Two collections (`Payment`, `Review`) include intentional duplication (`client`, `psw`) that is acceptable in document-oriented, audit-focused systems but is not strictly minimal under pure 3NF interpretation if those attributes are fully derivable from `appointment`.

So the design can be presented in either of these academically valid ways:

- **Strict theoretical framing:** mostly 3NF, with two controlled exceptions.
- **Practical engineering framing:** 3NF-aligned with deliberate denormalization for operational simplicity and auditability.

---

## If You Need Strict 3NF for Submission

To make the model unambiguously strict-3NF:

1. Remove `client` and `psw` from `Payment`.
2. Remove `client` and `psw` from `Review`.
3. Resolve participants via `appointment` joins/populates.
4. Keep validation to ensure appointment ownership rules.

This change reduces redundancy and update anomaly risk, at the cost of extra join/populate steps in read queries.
