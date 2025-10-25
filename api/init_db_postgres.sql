-- api/init_db_postgres.sql
-- PostgreSQL-compatible schema converted from MySQL `init_db.sql`.
-- Notes:
--  - INT AUTO_INCREMENT -> SERIAL (or IDENTITY)
--  - TINYINT(1) -> BOOLEAN
--  - Removed MySQL-specific `AFTER` clauses and backticks
--  - Use lower-case unquoted identifiers for portability

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    campus_email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- Create listings table
CREATE TABLE IF NOT EXISTS listings (
    listing_id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    condition VARCHAR(50) NOT NULL
);

-- Create wishlists table
CREATE TABLE IF NOT EXISTS wishlists (
    wishlist_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title_keyword VARCHAR(255) NOT NULL,
    author_keyword VARCHAR(255),
    course_code_keyword VARCHAR(50),
    edition INTEGER,
    alert_sent BOOLEAN DEFAULT FALSE
);

-- Create ratings table
CREATE TABLE IF NOT EXISTS ratings (
    rating_id SERIAL PRIMARY KEY,
    seller_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    buyer_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
