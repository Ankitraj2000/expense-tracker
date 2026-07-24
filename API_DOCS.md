# Expense Tracker API Documentation

Base URL: `http://localhost:8080` (dev) | `https://your-api.onrender.com` (prod)

All protected endpoints require the header:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Authentication

### Register
`POST /api/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response 201:**
```json
{
  "token": "eyJhbGc...",
  "tokenType": "Bearer",
  "userId": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### Login
`POST /api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response 200:** Same as Register response.

---

## User Profile

### Get Profile
`GET /api/users/me` 🔐

**Response 200:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-01-15T10:30:00"
}
```

---

### Update Profile
`PUT /api/users/me` 🔐

**Request:**
```json
{ "name": "Jane Doe", "email": "jane@example.com" }
```

**Response 200:** Updated UserProfileDto

---

### Change Password
`PATCH /api/users/me/password` 🔐

**Request:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newSecure456",
  "confirmPassword": "newSecure456"
}
```

**Response 200:**
```json
{ "message": "Password changed successfully" }
```

---

## Transactions

### List Transactions (Filter + Paginate)
`GET /api/transactions` 🔐

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `type` | string | `INCOME` or `EXPENSE` |
| `category` | string | e.g. `Food`, `Salary` |
| `startDate` | date | ISO: `2025-01-01` |
| `endDate` | date | ISO: `2025-12-31` |
| `keyword` | string | Search in description |
| `page` | int | 0-indexed (default: 0) |
| `size` | int | Page size (default: 10) |
| `sortBy` | string | `date` or `amount` |
| `sortDir` | string | `asc` or `desc` |

**Response 200:**
```json
{
  "content": [...],
  "totalElements": 42,
  "totalPages": 5,
  "number": 0,
  "size": 10
}
```

---

### Create Transaction
`POST /api/transactions` 🔐

**Request:**
```json
{
  "type": "EXPENSE",
  "category": "Food",
  "amount": 250.50,
  "description": "Lunch at restaurant",
  "date": "2025-07-15"
}
```

**Response 201:** TransactionResponse

---

### Get Transaction
`GET /api/transactions/{id}` 🔐

**Response 200:** TransactionResponse

---

### Update Transaction
`PUT /api/transactions/{id}` 🔐

**Request:** Same as Create

**Response 200:** Updated TransactionResponse

---

### Delete Transaction
`DELETE /api/transactions/{id}` 🔐

**Response 200:**
```json
{ "message": "Transaction deleted successfully" }
```

---

## Dashboard

### Get Dashboard Summary
`GET /api/dashboard` 🔐

**Response 200:**
```json
{
  "totalIncome": 50000.00,
  "totalExpense": 32000.00,
  "totalBalance": 18000.00,
  "monthlySavings": 5500.00,
  "recentTransactions": [...],
  "expenseByCategory": { "Food": 5000, "Shopping": 8000 },
  "monthlyIncome": { "JAN": 25000, "FEB": 25000, ... },
  "monthlyExpense": { "JAN": 15000, "FEB": 17000, ... }
}
```

---

## Reports

### Monthly Report
`GET /api/reports/monthly?year=2025&month=7` 🔐

### Yearly Report
`GET /api/reports/yearly?year=2025` 🔐

**Response 200 (both):**
```json
{
  "period": "July 2025",
  "totalIncome": 25000.00,
  "totalExpense": 17000.00,
  "netSavings": 8000.00,
  "expenseByCategory": { "Food": 5000, "Bills": 3000 },
  "incomeByCategory": { "Salary": 20000, "Freelancing": 5000 },
  "transactions": [...]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email address",
    "amount": "Amount must be greater than zero"
  },
  "timestamp": "2025-07-15T10:30:00"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized (invalid/expired token) |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

## Valid Categories

### Income Categories
`Salary`, `Freelancing`, `Business`, `Investments`, `Other`

### Expense Categories
`Food`, `Shopping`, `Travel`, `Bills`, `Medical`, `Entertainment`, `Education`, `Other`
