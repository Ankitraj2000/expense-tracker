-- ============================================================
-- Expense Tracker - Flyway V1 Initial Schema
-- ============================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(100)        NOT NULL,
    email       VARCHAR(150)        NOT NULL UNIQUE,
    password    VARCHAR(255)        NOT NULL,
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(20)         NOT NULL CHECK (type IN ('INCOME', 'EXPENSE')),
    category    VARCHAR(50)         NOT NULL,
    amount      DECIMAL(15, 2)      NOT NULL CHECK (amount > 0),
    description VARCHAR(500),
    date        DATE                NOT NULL,
    created_at  TIMESTAMP           NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_transactions_user_id   ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date       ON transactions(date);
CREATE INDEX IF NOT EXISTS idx_transactions_type       ON transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category   ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_users_email             ON users(email);
