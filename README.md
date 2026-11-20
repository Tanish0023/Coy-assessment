# Coy – Discover Experience (Task B Implementation)

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.21-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=flat&logo=sqlite)](https://www.sqlite.org/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.11-FF0055?style=flat&logo=framer)](https://www.framer.com/motion/)

A standalone full-stack application replicating **Coy's Discover Experience**, built for **Part B of the Coy SDE Intern Assignment**. Featuring a mobile-first gesture and button swipe interface, an atomic mutual matching engine, a dedicated Matches view, match celebration screens, and strict privacy guarantees.

---

## 📖 Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Key Features](#key-features)
4. [Strict Privacy Architecture](#strict-privacy-architecture)
5. [Database Design](#database-design)
6. [API Documentation](#api-documentation)
7. [Installation & Setup](#installation--setup)
8. [Database Seeding](#database-seeding)
9. [Running the Application](#running-the-application)
10. [Automated Testing](#automated-testing)
11. [Deployment Instructions](#deployment-instructions)
12. [Milestone Git Commits](#milestone-git-commits)

---

## 1. Project Overview

The **Coy Discover** module provides an authentic dating app discovery experience where users discover candidate profiles, swipe right to like or left to pass, and experience mutual matching in real time:
- **Mobile-First Gestures & Desktop Buttons**: Smooth touch and drag gestures with physics, dynamic rotation, and real-time visual feedback stamps ("LIKE" in green, "NOPE" in red), paired with elevated action buttons.
- **Strict Privacy Guarantees**: Profiles who have already liked the logged-in user are **strictly hidden** across all API responses, queries, and frontend state until a mutual like occurs.
- **Mutual Matching System**: A match is created atomically and canonically if and only if both users have liked each other.
- **Match Celebration Modal**: Interactive celebration overlay displaying avatar collision and haptic animations when a mutual match is formed.
- **Dedicated Matches View**: Accessible from Discover to browse mutual matches, inspect full profile bios, college/city, and interests.
- **Persistent SQLite Storage**: Backed by SQLite via Prisma ORM, surviving page reloads and server restarts.

---

## 2. Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide React icons, Framer Motion.
- **Backend**: Next.js Route Handlers (`app/api/*`), TypeScript.
- **Database & ORM**: SQLite (`dev.db`) with Prisma ORM.
- **Testing & Tooling**: Custom TypeScript API test suite (`tests/api-test.ts`), `tsx` runner.

---

## 3. Key Features

| Feature | Description |
| :--- | :--- |
| **Card Stack Feed** | Displays active card with background peek effect; optimistic transitions. |
| **Swipe Gestures** | Drag physics on mobile with velocity detection and threshold-based completion. |
| **Visual Stamp Feedback** | Angle-tilted "LIKE" and "NOPE" badges fade in with gesture intensity. |
| **Desktop Action Bar** | Pass (X) and Like (Heart) buttons with hover states and micro-animations. |
| **Idempotent Matching** | Canonical ordering (`user1Id < user2Id`) with unique constraint prevents duplicates. |
| **Match Celebration** | Floating avatar collision with glowing ring animation and messaging triggers. |
| **Matches Section** | Accessible from Discover; reveals mutual connections with timestamp and bio sheet. |
| **Demo Reset Option** | Quick-reset button in empty state to re-test the experience without resetting DB manually. |
| **Home Tab Placeholder** | Bottom navigation includes Home (placeholder as specified) and Discover tabs. |

---

## 4. Strict Privacy Architecture

One of the central requirements of the assignment is: **NEVER reveal users who liked the logged-in user unless the user has also liked them.**

### How this is strictly enforced:
1. **At the Database Query Level (`/api/feed`)**:
   - The query excludes profiles already swiped by the logged-in user.
   - It selects **only** public profile attributes (`id`, `name`, `age`, `photoUrl`, `bio`, `cityOrCollege`, `occupation`, `interests`, `verified`).
   - Zero incoming like records or swipe status fields are joined or exposed.
2. **At the API Response Level (`/api/swipe`)**:
   - If the logged-in user likes a profile that has *not* liked them yet, the API responds with:
     ```json
     { "success": true, "matched": false }
     ```
   - No hint, pending flag, or like count is ever transmitted.
3. **In the Matches Endpoint (`/api/matches`)**:
   - Strictly queries the `Match` table (which only contains verified mutual pairs).
   - Unmatched incoming likes remain completely inaccessible to the client.

---

## 5. Database Design

### Prisma Models (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id             String    @id @default(cuid())
  email          String?   @unique
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  profile        Profile?
  swipesGiven    Swipe[]   @relation("Swiper")
  swipesReceived Swipe[]   @relation("Swiped")
  matchesAsUser1 Match[]   @relation("User1Matches")
  matchesAsUser2 Match[]   @relation("User2Matches")
}

model Profile {
  id            String    @id @default(cuid())
  userId        String    @unique
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  name          String
  age           Int
  photoUrl      String
  bio           String
  cityOrCollege String
  occupation    String?
  interests     String    // JSON stringified array of strings
  verified      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model Swipe {
  id        String   @id @default(cuid())
  swiperId  String
  swipedId  String
  action    String   // "LIKE" | "PASS"
  createdAt DateTime @default(now())

  swiper    User     @relation("Swiper", fields: [swiperId], references: [id], onDelete: Cascade)
  swiped    User     @relation("Swiped", fields: [swipedId], references: [id], onDelete: Cascade)

  @@unique([swiperId, swipedId])
  @@index([swiperId])
  @@index([swipedId, action])
}

model Match {
  id        String   @id @default(cuid())
  user1Id   String
  user2Id   String
  createdAt DateTime @default(now())

  user1     User     @relation("User1Matches", fields: [user1Id], references: [id], onDelete: Cascade)
  user2     User     @relation("User2Matches", fields: [user2Id], references: [id], onDelete: Cascade)

  @@unique([user1Id, user2Id])
  @@index([user1Id])
  @@index([user2Id])
}
```

---

## 6. API Documentation

### 1. `GET /api/feed`
Retrieves discovery candidate profiles eligible for the logged-in user. Excludes already-swiped profiles and never leaks incoming like data.

**Response `200 OK`**:
```json
{
  "success": true,
  "count": 32,
  "profiles": [
    {
      "id": "cmwon8h4w0001k2ek64lc3e1c",
      "name": "Sophia Martinez",
      "age": 22,
      "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "bio": "Golden hour hunter, amateur ceramicist, and passionate about matchas with oat milk.",
      "cityOrCollege": "NYU • Stern",
      "occupation": "Design Strategist",
      "interests": ["Ceramics", "Matcha", "Indie Rock", "Film Photography", "Museums"],
      "verified": true
    }
  ]
}
```

---

### 2. `POST /api/swipe`
Records a user swipe (`like` or `pass`). Checks for reciprocal likes atomically inside a database transaction.

**Request Body**:
```json
{
  "profileId": "cmwon8h4w0001k2ek64lc3e1c",
  "action": "like"
}
```

**Response `200 OK` (Mutual Match)**:
```json
{
  "success": true,
  "matched": true,
  "match": {
    "id": "cmwonbven0007962tyhq06lw3",
    "profile": {
      "id": "cmwon8h4w0001k2ek64lc3e1c",
      "name": "Sophia Martinez",
      "age": 22,
      "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      "bio": "Golden hour hunter, amateur ceramicist, and passionate about matchas with oat milk.",
      "cityOrCollege": "NYU • Stern",
      "occupation": "Design Strategist",
      "interests": ["Ceramics", "Matcha", "Indie Rock", "Film Photography", "Museums"]
    }
  }
}
```

**Response `200 OK` (No Match / Pass / One-Sided Like)**:
```json
{
  "success": true,
  "matched": false
}
```

**Response `409 Conflict` (Duplicate Swipe)**:
```json
{
  "success": false,
  "error": "Profile has already been swiped on."
}
```

---

### 3. `GET /api/matches`
Returns all mutual matches for the logged-in user.

**Response `200 OK`**:
```json
{
  "success": true,
  "count": 1,
  "matches": [
    {
      "id": "cmwonbven0007962tyhq06lw3",
      "createdAt": "2026-11-20T07:16:58.175Z",
      "matchedAt": "2026-11-20T07:16:58.175Z",
      "profile": {
        "id": "cmwon8h4w0001k2ek64lc3e1c",
        "userId": "user_sophia_01",
        "name": "Sophia Martinez",
        "age": 22,
        "photoUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
        "bio": "Golden hour hunter, amateur ceramicist...",
        "cityOrCollege": "NYU • Stern",
        "occupation": "Design Strategist",
        "interests": ["Ceramics", "Matcha", "Indie Rock"],
        "verified": true
      }
    }
  ]
}
```

---

## 7. Installation & Setup

### Prerequisites
- Node.js 18.x or newer (compatible with Node 20, 22, and 24).
- npm 9.x or newer.

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/Tanish0023/Coy-assessment.git
cd Coy-assessment

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
```

---

## 8. Database Seeding

Initialize and seed the SQLite database with 32 candidate profiles (including 8 confidential pre-seeded incoming likes for demonstration):

```bash
# Push Prisma schema to SQLite
npm run db:push

# Execute independent database seed script
npm run db:seed
```

---

## 9. Running the Application

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

---

## 10. Automated Testing

Run the automated verification test suite:

```bash
npm run test:api
```

This verifies:
1. Clean database re-seeding.
2. Feed eligibility and privacy enforcement (zero leaked like data across 32 profiles).
3. One-sided like (persisted, no match triggered).
4. Pass action (persisted, candidate excluded from feed).
5. Mutual like (match created atomically and returned with partner details).
6. Duplicate swipe rejection (enforcing unique constraints).
7. Feed exclusion (swiped profiles never reappear).
8. Matches query (returns only confirmed mutual connections).
9. Automatic re-seed to leave pristine demo state.

---

## 11. Deployment Instructions

This application is ready to deploy to any modern hosting platform (e.g. Vercel, Railway, Fly.io, or VPS).

### Deploying to Vercel
1. Push repository to GitHub.
2. Import project into Vercel.
3. In Build & Development settings:
   - Build Command: `npx prisma generate && npm run build`
4. Set Environment Variables:
   - `DATABASE_URL`: `file:./dev.db` (for serverless environments requiring distributed persistence, connect a PostgreSQL/Turso URL by changing the Prisma datasource provider to `postgresql` or `turso`).

---

## 12. Milestone Git Commits

This project was built following the strict milestone specifications on the `main` branch:

- **Milestone 1**: `799116a` – Project setup, Prisma schema, database and profile seeding.
- **Milestone 2**: `b52bf03` – Backend APIs and mutual matching logic.
- **Milestone 3**: `5f31e51` – Discover UI, profile cards and swipe interactions.
- **Milestone 4**: `5fe1b71` – Matches view and match celebration screen.
- **Milestone 5**: `75bf198` – Integration, testing, bug fixes and final polish.