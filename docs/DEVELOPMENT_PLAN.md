# PSWCares – Capstone Plan

> Phase 1 (Initiation & Planning) was completed and submitted as the approved project proposal.

---

# Phase 2 – Requirements Analysis (Week 2)

## 2.1 Functional Requirements

- FR1: User registration and login
- FR2: Role-based access (PSW, Client, Admin)
- FR3: Admin approval before PSW listing
- FR4: Appointment booking system
- FR5: Appointment status tracking
- FR6: Payment tracking (Stripe test mode)
- FR7: Chat access after confirmation
- FR8: Reviews allowed after completion

## 2.2 Non-Functional Requirements

- JWT authentication and password hashing
- Response time under 3 seconds
- Basic mobile responsiveness
- Input validation on all forms
- Secure file upload handling

## 2.3 Modeling

- Use Case Diagram
- Detailed Use Case Descriptions
- Data Dictionary
- Final Entity List

### Deliverables

- Requirements Specification Document
- Use Case Diagram
- Data Dictionary

---

# Phase 3 – System Design

## Week 3 – High-Level Design

### Architecture Design

- 3-tier architecture diagram
- Deployment architecture diagram
- Chat communication diagram
- Payment flow diagram

### Database Design

Collections:

- Users
- PSWProfile
- Appointments
- Payments
- Messages
- Reviews

### API Design

- Endpoint list
- Request/response formats
- Standard error format

### Deliverables

- System Architecture Diagram
- ERD
- API Design Document

---

## Week 4 – Detailed Design

### Security Design

- JWT flow
- Role middleware logic
- File validation rules
- Input sanitization plan

### Sequence Diagrams

- Booking workflow
- Admin approval workflow
- Payment workflow
- Chat workflow

### Test Planning

- Test Plan document
- 2–3 test cases per feature

### Deliverables

- Detailed Design Document
- Sequence Diagrams
- Test Plan

---

# Phase 4 – Implementation

## Week 5 – Core Infrastructure

### Backend

- Express server setup
- MongoDB connection
- User schema
- Authentication routes
- JWT middleware
- Role protection

### Frontend

- React routing setup
- Login/Register UI
- Protected routes
- Basic dashboard layouts

---

## Week 6 – Business Logic

### PSW Module

- Profile CRUD
- Certificate upload
- Approval status handling

### Admin Module

- Pending approvals list
- Approve/reject logic

### Booking Module

- Appointment schema
- Booking creation
- Status transitions

---

## Week 7 – Advanced Features

### Payment Module

- Stripe test integration
- Payment schema
- Link payment to appointment

### Chat Module

- Socket.io setup
- Room logic
- Message storage

### Review Module

- Review schema
- Restrict to completed appointments
- Rating calculation

---

# Phase 5 – Testing

## Week 8 – System Testing

- Full workflow testing
- Authentication testing
- Role access validation
- Edge case testing
- Booking conflict testing
- Chat access testing
- Payment flow testing
- Bug log maintenance

---

## Week 9 – User Acceptance & Optimization

- Simulated full demo run
- Performance improvements
- UI cleanup
- Remove debug logs
- Route protection validation
- Final system retesting

### Deliverables

- Test Report
- Bug Fix Log

---

# Phase 6 – Deployment & Expo Preparation

## Week 10 – Deployment

### Production Setup

- Production build
- Nginx configuration
- Domain + SSL
- Environment variables setup
- Production database setup
- Final production testing

### Documentation Finalization

- Final Report
- Clean Architecture Diagram
- Final ERD
- User Manual
- Deployment Guide

### Expo Preparation

- Demo accounts seeded
- Stable demo script
- Backup recorded demo
- QR code for live site
- Poster and pamphlet finalized

---

# Final SDLC Flow

Phase 1 – Initiation (Completed)  
Phase 2 – Requirements  
Phase 3 – Design  
Phase 4 – Implementation  
Phase 5 – Testing  
Phase 6 – Deployment

---

End of Plan.
