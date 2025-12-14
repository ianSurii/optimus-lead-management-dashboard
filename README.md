# Optimus Lead Management Dashboard

## Overview
A full-stack lead management dashboard for sales teams, featuring advanced filtering, analytics, and multi-dimensional reporting. Built with a modern React frontend and Node.js/Express backend, using Docker for easy deployment.

---

## Table of Contents
- [Optimus Lead Management Dashboard](#optimus-lead-management-dashboard)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Architecture \& Tech Stack](#architecture--tech-stack)
  - [Setup \& Run Instructions](#setup--run-instructions)
    - [Prerequisites](#prerequisites)
    - [Local Development](#local-development)
    - [Docker Compose](#docker-compose)
  - [Development Scripts](#development-scripts)
  - [Trade-offs \& Challenges](#trade-offs--challenges)
  - [Improvements (Given More Time)](#improvements-given-more-time)
  - [🔌 API Endpoints](#-api-endpoints)
    - [Base URL](#base-url)
    - [Endpoints](#endpoints)
  - [📊 API Details](#-api-details)
    - [1. Dashboard Endpoint](#1-dashboard-endpoint)
      - [Query Parameters (All Optional)](#query-parameters-all-optional)
    - [Desktop Demo](#desktop-demo)
    - [Mobile Demo](#mobile-demo)

---

## Features
- Responsive React dashboard (TypeScript, Tailwind CSS)
- Multi-select, multi-dimensional filtering (campaign, product, segment, agent)
- Realistic mock data: 6 users, 6 branches, 5 products, 5 campaigns, 4 segments, 150+ transactions
- Skeleton loading screens for smooth UX
- KPI cards, actionable insights, charts (line, donut), rankings, agent performance
- Backend API (Node.js/Express) serving mock data
- Dockerized for easy local or cloud deployment

---

**Layout Structure:Desktop**
```
┌─────────────────────────────────┐
│         Banner (Optional)       │
├─────────────────────────────────┤
│           Navbar                │
├──────┬──────────────────────────┤
│      │                          │
│ Side │     Main Content         │
│ bar  │     (Children)           │
│      │                          │
└──────┴──────────────────────────┘
```

**Layout Structure:Mobile**
```
┌────────────────────────────────┐
│         Banner (Optional)      │
├────────────────────────────────┤
│  D  |   Navbar                 │
├  R  |──────────────────────────┤
│  A  │                          │
│  W  │     Main Content         │
│  E  │     (Children)           │
│  R  │                          │
└─────┴──────────────────────────┘
```

## Architecture & Tech Stack
- **Frontend:** React 19, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **Data:** JSON mock data (no DB required)
- **Containerization:** Docker, Docker Compose

**Folder Structure:**
- `/frontend` — React app (src/components, pages, hooks, types, utils)
- `/backend` — Express server, API routes, mock data

---
---

## Setup & Run Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)
- Docker & Docker Compose (for containerized run)

### Local Development
1. **Clone the repository:**
   ```bash
   git clone https://github.com/ianSurii/optimus-lead-management-dashboard.git
   cd ogilvy
   ```
2. **Install dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
3. **Start the backend:**
   ```bash
   cd ../backend
   npm start --port 3000[default]
   ```
4. **Start the frontend:**
   ```bash
   cd ../frontend
   npm start --port 8080
   ```
5. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:8080](http://localhost:8080)

### Docker Compose
To run both frontend and backend with Docker Compose:
```bash
docker-compose up --build
```
OR
```bash
docker compose up --build
```
To rebuild and recreate containers, use:
```bash
docker compose up --build --force-recreate
```

Incase of cache issues, you can also try:
```bash
docker-compose up --build --no-cache
```   
1. **Access the app:**
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:8080](http://localhost:8080)

---

## Development Scripts
- `npm start` — Start dev server (frontend/backend)
- `npm run build` — Build frontend for production
- `docker-compose up` — Start all services in containers

---

## Trade-offs & Challenges
- **Mock Data:** Used static JSON for simplicity; a real DB would be used in production.Data was implimented to simulate realistic scenarios with diverse attributes and store state in a normalized manner. SOme credentials were hardcoded for demo purposes.
```json
 "banner": {
    "active": true,
    "text": "We are donating <span style='color: #E91E63; font-weight: bold;'>50% of June's Sales</span> across premises to the <a href='#' style='color: #E91E63;'>Napa Justice Initiative</a>, a nonprofit challenging racial and economic injustice.",
    "style": "promotional",
    "link_url": "/about/csr"
  }
```
- **Filtering:** Multi-dimensional filter logic is handled in the frontend for demo; scalable APIs would be needed for large datasets.
- **Responsiveness:** Tailwind used for rapid layout, but some edge cases may need polish.This was prioritized to ensure usability across devices.
- **Testing:** Manual testing; no automated test suite included due to time constraints.

---

## Improvements (Given More Time)
- Add authentication & user roles
```json
 "user_profile": {
    "user_id": "U001",
    "first_name": "Ian",
    "last_name": "Muthuri",
    "role": "Product Manager",
    "managed_product_id": "P001",
    "primary_branch_id": "B001",
    "profile_pic_url": "logo-sm.png"
  }
````
- Implement relation database (PostgreSQL/MySQL)
- Implimenting caching layer (Redis) for performance
- Add automated tests (unit, integration, e2e)
- Enhance error handling and input validation
- Add CI/CD pipeline for automated deployment
  - Github Actions
- 

---

## 🔌 API Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/` | API health check | None |
| GET | `/dashboard` | Get dashboard data | `date`, `branch_id`, `user_id`, `campaign_id`, `segment_id`, `product_id` |
| GET | `/user` | Get user profile | None |
| GET | `/notifications` | Get user notifications | None |
| GET | `/banner` | Get banner message | None |

---

## 📊 API Details

### 1. Dashboard Endpoint

**GET** `/api/v1/dashboard`

Retrieves comprehensive dashboard data including KPIs, charts, rankings, and transaction lists.

#### Query Parameters (All Optional)

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `date` | string | Target date (YYYY-MM-DD). Returns 31 days of data ending on this date | `2024-12-14` |
| `date_from` | string | Start date for custom range | `2024-11-01` |
| `date_to` | string | End date for custom range | `2024-11-30` |
| `branch_id` | string | Filter by specific branch | `BRN-001` |
| `user_id` | string | Filter by specific agent/user | `USR-005` |
| `campaign_id` | string | Filter by campaign | `CMP-001` |
| `segment_id` | string | Filter by customer segment | `SEG-002` |
| `product_id` | string | Filter by product | `PRD-003` |

### Desktop Demo
<video src="screencast/Desktop.webm" controls width="400"></video>
<br>

### Mobile Demo
<video src="screencast/Mobile.webm" controls width="400"></video>