# appointment-platform
A realistic, defensible, and high-performance **PERN stack** appointment booking platform. This project focuses on a clean monolith architecture and robust database constraints.

[Deployed app link](https://pern.kerochan.lol)

[Demo video](https://files.catbox.moe/8ucz4e.webm)

---

## Philosophy

* **Simple**: Focuses on core business logic without unnecessary abstractions.
* **Realistic**: Solves a common small-business problem: managing time-slot availability.
* **Defensible**: Architecture (from the DB constraints to JWT storage) is made with security and concurrency in mind.

---

## Tech Stack

* **Frontend**: React (Vite), Tailwind CSS, React Router SPA.
* **Backend**: Node.js & Express REST API.
* **Database**: PostgreSQL.
* **Authentication**: JWT (JSON Web Tokens) with `bcrypt` password hashing.
* **Deployment**: Optimized for VPS (Nginx reverse proxy) or Render.

---

## Core Features

### For Users

* **Secure Auth**: Register and log in to manage your schedule.
* **Live Availability**: View real-time available time slots.
* **Booking Management**: Book a slot, view your active appointments, or cancel them if needed.

### For Admins

* **Availability Control**: Create and manage available time slots.
* **Global Overview**: View and manage all user bookings across the platform.
* **Concurrency Protection**: Admins cannot double-book a single time slot.

---

## Database Design & Integrity

The database is built for reliability. The core logic is enforced at the **database layer** rather than just the application layer.

### Schema Overview

* **`users`**: Stores email (unique), `password_hash`, and roles (user/admin).
* **`time_slots`**: Tracks available windows created by admins.
* **`bookings`**: Connects users to slots.

To prevent race conditions where two users try to book the same slot at the same millisecond, I implemented a **`UNIQUE` constraint** on `time_slot_id` in the `bookings` table.

This is important because even if the frontend or backend logic fails to catch a conflict, the database will reject a second insert to protect data integrity.

---

## Security Awareness

* **Password Hashing**: Never stores raw passwords; uses `bcrypt`.
* **SQL Injection Protection**: Uses parameterized queries for all database interactions.
* **Protected Routes**: Frontend and backend routes are guarded by JWT middleware.
* **Validation**: Strict middleware validation for email formats and time-slot data.

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/kerochan-web/appointment-platform.git
cd appointment-platform
npm run install-all
npm run dev
```

### 2. Environment Setup

Create a `.env` file in the root:

```env
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
PORT=5000
VITE_API_URL=http://localhost:5000

```

### 3. Run Development

```bash
# Start Backend
npm run dev

# Start Frontend
npm run dev
```
