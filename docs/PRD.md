# Base Platform – Product Requirements Document (PRD)

## 1. Overview

This platform is a web product that allows users to:
- Browse listings
- View listing details
- Contact sellers
- Manage listings (authenticated users)

The system includes:
- Frontend (React / Vite)
- API (Node.js / Express)
- Authentication system

---

## 2. User Roles

### 2.1 Guest User
- Can browse listings
- Can view listing details
- Cannot create listings
- Cannot access admin areas

### 2.2 Authenticated User
- Can log in
- Can create listings
- Can edit their own listings
- Can delete their own listings

---

## 3. Core Features

### 3.1 Authentication
- User can log in with email and password
- Invalid credentials should show an error
- After login, user is redirected to dashboard
- Protected routes require authentication

### 3.2 Listings
- Listings must have:
  - Title
  - Description
  - Price
  - Image
- Price must be a positive number
- Submitting incomplete forms should show validation errors

### 3.3 API Health
- `/health` endpoint must return status 200
- Response should indicate system is running

---

## 4. Validation Rules

- Email must be valid format
- Password cannot be empty
- Price cannot be negative
- Required fields must not be empty

---

## 5. Error Handling

- API errors should return proper HTTP status codes
- 401 for unauthorized
- 400 for validation errors
- 500 only for unexpected server errors

---

## 6. Non-Functional Requirements

- App must start without crashing
- API must respond within 2 seconds
- Invalid routes return 404
