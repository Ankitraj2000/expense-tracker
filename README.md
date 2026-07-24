# 🏦 Expense Tracker

> A production-ready, full-stack personal finance application built with **React + Vite**, **Spring Boot**, and **PostgreSQL**.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?logo=springboot)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

---

## ✨ Features

| Feature | Details |
|---------|---------|
| 🔐 **Auth** | JWT register/login, BCrypt passwords, protected routes |
| 📊 **Dashboard** | Balance, income, expenses, monthly savings, 3 charts |
| 💰 **Income** | Add/Edit/Delete with 5 categories |
| 💸 **Expenses** | Add/Edit/Delete with 8 categories |
| 🔍 **Transactions** | Search, filter, sort, paginate all records |
| 📈 **Reports** | Monthly & yearly reports with category breakdowns |
| 📄 **PDF Export** | Downloadable PDF with summary + transactions table |
| 🌙 **Dark Mode** | OS preference-aware with manual toggle |
| 📱 **Responsive** | Mobile, tablet, and desktop layouts |

---

## 🏗️ Project Structure

```
expense-tracker/
├── frontend/                    # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/          # Recharts components
│   │   │   ├── dashboard/       # StatsCard, RecentTransactions
│   │   │   ├── layout/          # Sidebar, Navbar, Layout
│   │   │   ├── transactions/    # Form, Table, Filter
│   │   │   └── ui/              # Button, Input, Modal, Badge, Loader
│   │   ├── context/             # AuthContext, ThemeContext
│   │   ├── pages/               # LoginPage, DashboardPage, etc.
│   │   ├── services/            # Axios service modules
│   │   └── utils/               # formatters, validators, pdfGenerator
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                     # Spring Boot
    ├── src/main/java/com/expensetracker/
    │   ├── config/              # SecurityConfig
    │   ├── controller/          # Auth, User, Transaction, Dashboard, Report
    │   ├── dto/                 # Request/Response DTOs
    │   ├── exception/           # GlobalExceptionHandler, custom exceptions
    │   ├── model/               # User, Transaction, TransactionType
    │   ├── repository/          # JPA Repositories
    │   ├── security/            # JwtUtil, JwtAuthFilter, UserDetailsServiceImpl
    │   └── service/             # AuthService, UserService, TransactionService, etc.
    ├── src/main/resources/
    │   ├── application.properties
    │   └── db/migration/V1__init.sql
    └── pom.xml
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| npm | 9+ |
| PostgreSQL | 14+ (or Neon cloud) |

### 1. Clone & Configure

```bash
git clone <your-repo-url>
cd expense-tracker
```

### 2. Backend Setup

```bash
cd backend
```

Create your database (skip if using Neon):
```sql
CREATE DATABASE expense_tracker;
```

Set environment variables (or edit `application.properties`):
```bash
# Windows PowerShell
$env:DATABASE_URL="jdbc:postgresql://localhost:5432/expense_tracker"
$env:DATABASE_USERNAME="postgres"
$env:DATABASE_PASSWORD="your_password"
$env:JWT_SECRET="your_256bit_base64_secret_here"
```

Run the backend:
```bash
mvn spring-boot:run
```

Backend starts at: **http://localhost:8080**

### 3. Frontend Setup

```bash
cd frontend

# Copy environment file
cp .env.example .env
# Edit .env: set VITE_API_URL=http://localhost:8080

npm install
npm run dev
```

Frontend starts at: **http://localhost:5173**

---

## 🔑 Environment Variables

### Backend (`application.properties` / environment)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/expense_tracker` |
| `DATABASE_USERNAME` | DB username | `postgres` |
| `DATABASE_PASSWORD` | DB password | `password` |
| `JWT_SECRET` | 256-bit Base64 secret | (dev default) |
| `CORS_ORIGINS` | Allowed frontend origins | `http://localhost:5173` |

### Frontend (`.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend base URL | `http://localhost:8080` |

---

## 📡 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login + get JWT |
| GET | `/api/users/me` | Get user profile |
| PUT | `/api/users/me` | Update profile |
| PATCH | `/api/users/me/password` | Change password |
| GET | `/api/transactions` | List (filter/sort/page) |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions/{id}` | Get by ID |
| PUT | `/api/transactions/{id}` | Update |
| DELETE | `/api/transactions/{id}` | Delete |
| GET | `/api/dashboard` | Dashboard summary |
| GET | `/api/reports/monthly?year=&month=` | Monthly report |
| GET | `/api/reports/yearly?year=` | Yearly report |

---

## 🗄️ Database Schema

```sql
-- Users
CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(20) NOT NULL CHECK (type IN ('INCOME','EXPENSE')),
    category    VARCHAR(50) NOT NULL,
    amount      DECIMAL(15,2) NOT NULL CHECK (amount > 0),
    description VARCHAR(500),
    date        DATE NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);
```

---

## 🧪 Running Tests

```bash
cd backend
mvn test
```

---

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions for:
- **Frontend** → Vercel
- **Backend** → Render
- **Database** → Neon PostgreSQL

---

## 📌 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, React Router 6 |
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Auth | JWT (jjwt), BCrypt |
| Database | PostgreSQL 16, Hibernate, Flyway |
| PDF | jsPDF + html2canvas |
| Deployment | Vercel + Render + Neon |

---

## 📄 License

MIT — free to use and modify.
