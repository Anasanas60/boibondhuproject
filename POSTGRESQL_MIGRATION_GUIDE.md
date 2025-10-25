# MySQL to PostgreSQL Migration Guide

This document provides a comprehensive guide for migrating the BoiBondhu application from MySQL to PostgreSQL.

## Overview

All PHP files have been migrated from MySQL (using mysqli extension) to PostgreSQL (using PDO). This migration includes:

- Database connection changes
- SQL syntax updates
- Query execution method changes
- Data type conversions

## Prerequisites

1. **PostgreSQL Installation**: Install PostgreSQL 12 or higher
2. **PHP PDO Extension**: Ensure PHP has the PostgreSQL PDO driver installed
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install php-pgsql
   
   # On macOS with Homebrew
   brew install php
   
   # Verify installation
   php -m | grep pdo_pgsql
   ```

## Database Setup

### 1. Create PostgreSQL Database

```sql
-- Connect to PostgreSQL as superuser
psql -U postgres

-- Create database
CREATE DATABASE boibondhu;

-- Create user (optional)
CREATE USER boibondhu_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE boibondhu TO boibondhu_user;
```

### 2. Update Connection Configuration

Edit `api/db_connect.php` and update these constants:

```php
define('DB_HOST', 'localhost');      // Your PostgreSQL host
define('DB_PORT', '5432');           // Default PostgreSQL port
define('DB_NAME', 'boibondhu');      // Your database name
define('DB_USERNAME', 'postgres');   // Your PostgreSQL username
define('DB_PASSWORD', '');           // Your PostgreSQL password
```

### 3. Run Migration Scripts

Execute the SQL migration scripts in this order:

```bash
# Connect to your database
psql -U postgres -d boibondhu

# Run initialization script
\i api/init_db.sql

# Run additional migrations
\i api/migrate_listings.sql
\i api/add_profile_picture_column.sql
\i api/create_messages_table.sql
```

## Key Changes Made

### 1. Database Connection

**Before (MySQL with mysqli):**
```php
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
```

**After (PostgreSQL with PDO):**
```php
$dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;
$conn = new PDO($dsn, DB_USERNAME, DB_PASSWORD, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false
]);
```

### 2. Prepared Statements

**Before (mysqli):**
```php
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
```

**After (PDO):**
```php
$stmt = $conn->prepare("SELECT * FROM users WHERE email = :email");
$stmt->bindValue(':email', $email, PDO::PARAM_STR);
$stmt->execute();
$user = $stmt->fetch(PDO::FETCH_ASSOC);
```

### 3. Insert ID Retrieval

**Before:**
```php
$stmt->insert_id
```

**After:**
```php
$conn->lastInsertId()
```

### 4. Row Count

**Before:**
```php
$result->num_rows
$stmt->affected_rows
```

**After:**
```php
$stmt->rowCount()
```

### 5. SQL Syntax Changes

#### AUTO_INCREMENT → SERIAL
```sql
-- Before (MySQL)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY
);

-- After (PostgreSQL)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY
);
```

#### TINYINT → SMALLINT
```sql
-- Before (MySQL)
is_read TINYINT(1) DEFAULT 0

-- After (PostgreSQL)
is_read SMALLINT DEFAULT 0
```

#### Backticks → Double Quotes
```sql
-- Before (MySQL)
SELECT `condition` FROM Listings

-- After (PostgreSQL)
SELECT "condition" FROM Listings
```

#### LIKE → ILIKE (Case-Insensitive Search)
```sql
-- Before (MySQL)
WHERE title LIKE '%search%'

-- After (PostgreSQL)
WHERE title ILIKE '%search%'
```

#### NOW() → CURRENT_TIMESTAMP
```sql
-- Before (MySQL)
updated_at = NOW()

-- After (PostgreSQL)
updated_at = CURRENT_TIMESTAMP
```

#### ON UPDATE CURRENT_TIMESTAMP
```sql
-- Before (MySQL)
ALTER TABLE Listings
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- After (PostgreSQL) - Requires trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listings_updated_at
BEFORE UPDATE ON "Listings"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

#### LIMIT with Placeholders
```sql
-- Before (MySQL)
LIMIT ? OFFSET ?

-- After (PostgreSQL with PDO)
LIMIT :limit OFFSET :offset
```

### 6. Index Creation
```sql
-- Before (MySQL - inline in CREATE TABLE)
CREATE TABLE messages (
    ...,
    INDEX idx_sender_receiver (sender_id, receiver_id)
);

-- After (PostgreSQL - separate statements)
CREATE TABLE messages (...);
CREATE INDEX idx_sender_receiver ON messages(sender_id, receiver_id);
```

## Table Schema Reference

### Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    campus VARCHAR(100),
    year VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Listings Table
```sql
CREATE TABLE IF NOT EXISTS "Listings" (
    listing_id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    edition VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    "condition" VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id)
);
```

### Messages Table
```sql
CREATE TABLE IF NOT EXISTS messages (
    message_id SERIAL PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    message_text TEXT NOT NULL,
    is_read SMALLINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### Ratings Table
```sql
CREATE TABLE IF NOT EXISTS ratings (
    rating_id SERIAL PRIMARY KEY,
    seller_id INT NOT NULL,
    buyer_id INT NOT NULL,
    listing_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id),
    FOREIGN KEY (buyer_id) REFERENCES users(user_id)
);
```

### Wishlist Table
```sql
CREATE TABLE IF NOT EXISTS "Wishlist" (
    wishlist_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    listing_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (listing_id) REFERENCES "Listings"(listing_id) ON DELETE CASCADE
);
```

## Testing the Migration

### 1. Test Database Connection
```bash
php -r "require 'api/db_connect.php'; echo 'Connection successful!';"
```

### 2. Test Individual Endpoints

Use cURL or Postman to test:

```bash
# Test user registration
curl -X POST http://localhost/boibondhu/api/register.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost/boibondhu/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test listings
curl http://localhost/boibondhu/api/listings.php
```

## Common Issues and Solutions

### Issue 1: PDO Extension Not Found
**Error:** `could not find driver`

**Solution:**
```bash
# Ubuntu/Debian
sudo apt-get install php-pgsql
sudo systemctl restart apache2

# Check if installed
php -m | grep pdo_pgsql
```

### Issue 2: Connection Refused
**Error:** `SQLSTATE[08006] [7] could not connect to server`

**Solution:**
1. Verify PostgreSQL is running: `sudo systemctl status postgresql`
2. Check `pg_hba.conf` for proper authentication settings
3. Ensure PostgreSQL is listening on the correct port

### Issue 3: Table/Column Not Found
**Error:** `relation "listings" does not exist`

**Solution:**
PostgreSQL is case-sensitive. Use double quotes for mixed-case table names:
```sql
SELECT * FROM "Listings"  -- Correct
SELECT * FROM Listings    -- May fail
```

### Issue 4: Prepared Statement Errors
**Error:** `invalid parameter number`

**Solution:**
Ensure all placeholder names match:
```php
// Wrong
$stmt->bindValue(':email', $email);
// ... WHERE email = :user_email

// Correct
$stmt->bindValue(':email', $email);
// ... WHERE email = :email
```

## Performance Considerations

1. **Indexing**: PostgreSQL may require different indexing strategies
   ```sql
   CREATE INDEX idx_listings_seller ON "Listings"(seller_id);
   CREATE INDEX idx_listings_created ON "Listings"(created_at);
   ```

2. **Query Optimization**: Use EXPLAIN ANALYZE to optimize queries
   ```sql
   EXPLAIN ANALYZE SELECT * FROM "Listings" WHERE seller_id = 1;
   ```

3. **Connection Pooling**: Consider using PgBouncer for production environments

## Rollback Plan

If you need to rollback to MySQL:

1. Restore the original `api/db_connect.php` from version control
2. Restore original PHP files
3. Keep your MySQL database backup
4. Update any configuration files

## Additional Resources

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [PHP PDO Documentation](https://www.php.net/manual/en/book.pdo.php)
- [PostgreSQL vs MySQL Syntax Differences](https://wiki.postgresql.org/wiki/Things_to_find_out_about_when_moving_from_MySQL_to_PostgreSQL)

## Support

For issues related to this migration, please:
1. Check the error logs in PostgreSQL: `/var/log/postgresql/`
2. Check PHP error logs
3. Review this migration guide
4. Consult PostgreSQL documentation

---

**Migration Date:** 2025-10-25  
**Migrated By:** GitHub Copilot  
**Migration Status:** Complete ✅
