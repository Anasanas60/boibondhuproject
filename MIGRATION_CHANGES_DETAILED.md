# Line-by-Line Migration Changes Summary

This document provides a detailed breakdown of all changes made to migrate from MySQL to PostgreSQL.

## Files Modified

### 1. api/db_connect.php

**Line-by-line changes:**

| Original (MySQL) | Updated (PostgreSQL) | Line |
|-----------------|---------------------|------|
| `define('DB_SERVER', 'localhost');` | `define('DB_HOST', 'localhost');` | 5 |
| - | `define('DB_PORT', '5432');` | 6 (new) |
| `define('DB_USERNAME', 'root');` | `define('DB_USERNAME', 'postgres');` | 7 |
| `$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);` | `$dsn = "pgsql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME;` | 11 |
| - | `$conn = new PDO($dsn, DB_USERNAME, DB_PASSWORD, [` | 12 (new) |
| - | `    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,` | 13 (new) |
| - | `    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,` | 14 (new) |
| - | `    PDO::ATTR_EMULATE_PREPARES => false` | 15 (new) |
| - | `]);` | 16 (new) |
| `if ($conn->connect_error) {` | `} catch (PDOException $e) {` | 14 → 17 |
| `die("Connection failed: " . $conn->connect_error);` | `die("Connection failed: " . $e->getMessage());` | 15 → 18 |

### 2. api/register.php

**Key changes:**

- Line 46-50: `bind_param()` → `bindValue()` with named parameters
- Line 50: `$stmt->num_rows` → `$stmt->rowCount()`
- Line 54: Removed `$stmt->close()`
- Line 60-62: Converted to PDO bindValue syntax
- Line 64: Removed `$stmt->execute()` error handling with `$stmt->error`
- Line 70-71: Removed `$stmt->close()` and `$conn->close()`

### 3. api/login.php

**Key changes:**

- Line 40-42: Changed to PDO prepare with named parameter `:email`
- Line 46: `$result->num_rows` → `$stmt->rowCount()`
- Line 51: `$result->fetch_assoc()` → `$stmt->fetch(PDO::FETCH_ASSOC)`
- Line 69-70: Removed `$stmt->close()` and `$conn->close()`

### 4. api/create_listing.php

**Key changes:**

- Line 43: Backticks around `condition` changed to double quotes: `` `condition` `` → `"condition"`
- Line 43: Changed table name to use double quotes: `Listings` → `"Listings"`
- Line 43: Query converted to named parameters
- Line 44-51: Changed from `bind_param()` to multiple `bindValue()` calls
- Line 46: `$stmt->insert_id` → `$conn->lastInsertId()`
- Line 50-51: Removed `$stmt->close()` and `$conn->close()`

### 5. api/update_listing.php

**Key changes:**

- Line 44-53: Backtick around `condition` changed to double quotes
- Line 53: `NOW()` → `CURRENT_TIMESTAMP`
- Line 56-64: Changed from `bind_param()` to PDO `bindValue()`
- Line 65-66: Removed `$stmt->close()` and `$conn->close()`

### 6. api/delete_listing.php

**Key changes:**

- Line 45: Table name `Listings` → `"Listings"` with double quotes
- Line 45: Changed to named parameters `:listing_id`, `:seller_id`
- Line 46-47: Changed to PDO `bindValue()`
- Line 49: `$stmt->affected_rows` → `$stmt->rowCount()`
- Line 60-61: Removed `$stmt->close()` and `$conn->close()`

### 7. api/get_user_listings.php

**Key changes:**

- Line 29: Backtick around `condition` changed to double quotes
- Line 29: Table name `Listings` → `"Listings"`
- Line 29: Changed to named parameter `:user_id`
- Line 33-36: Changed from `$result->fetch_assoc()` to PDO fetch
- Line 45-46: Removed `$stmt->close()` and `$conn->close()`

### 8. api/listings.php

**Key changes:**

- Line 20: Backticks around `condition` changed to double quotes
- Line 20: Table names to double quotes: `Listings` → `"Listings"`
- Line 21: Removed `$conn->query()`, added `$conn->prepare()`
- Line 22: Added `$stmt->execute()`
- Line 24-26: Changed to PDO fetch loop
- Line 29-33: Simplified success response without error handling

### 9. api/search_listings.php

**Key changes:**

- Line 25: `LIMIT ? OFFSET ?` → `LIMIT :limit OFFSET :offset`
- Line 26-27: Changed to PDO bindValue
- Line 32-37: `LIKE` → `ILIKE` for case-insensitive search in PostgreSQL
- Line 43-50: Changed to named parameters with bindValue
- Line 62-63: Changed count query to use ILIKE
- Line 67: `$countResult->fetch_assoc()` → direct fetch
- Line 86: Removed `$conn->close()`

### 10. api/add_wishlist.php

**Key changes:**

- Line 34: Table name `Wishlist` → `"Wishlist"`
- Line 34: Changed to named parameters
- Line 35-36: Changed to PDO bindValue
- Line 38-39: `$result->num_rows` → `$stmt->rowCount()`
- Line 41-45: Removed statement close
- Line 48: Changed to named parameters
- Line 49-50: Changed to PDO bindValue
- Line 57-58: Removed closes

### 11. api/get_wishlist.php

**Key changes:**

- Line 29: Table names to double quotes with JOIN
- Line 33-36: Changed to PDO bindValue and fetch
- Line 45-46: Removed closes

### 12. api/remove_wishlist.php

**Key changes:**

- Line 34: Table name `Wishlist` → `"Wishlist"`
- Line 34: Changed to named parameters
- Line 35-36: Changed to PDO bindValue
- Line 38: `$stmt->affected_rows` → `$stmt->rowCount()`
- Line 47-48: Removed closes

### 13. api/send_message.php

**Key changes:**

- Line 42: Changed to named parameters for INSERT
- Line 45-46: Removed error handling with `$conn->error`
- Line 50-52: Changed to PDO bindValue
- Line 58-59: Removed closes

### 14. api/get_messages.php

**Key changes:**

- Line 34-35: Changed to named parameters
- Line 41: Removed error check with `$conn->error`
- Line 45-48: Changed to PDO bindValue
- Line 50-63: Changed fetch loop to PDO
- Line 67-68: Removed closes

### 15. api/get_conversations.php

**Key changes:**

- Line 33-53: Complex query with 7 user_id references changed to named parameters `:uid1` through `:uid7`
- Line 58: Removed error check
- Line 62-69: Changed to PDO bindValue for all 7 parameters
- Line 73-83: Changed fetch loop
- Line 85-86: Removed closes

### 16. api/rate_seller.php

**Key changes:**

- Line 50-53: Changed CHECK query to named parameters
- Line 55-58: Changed rowCount check
- Line 63: Changed INSERT to named parameters
- Line 64-69: Changed to PDO bindValue
- Line 72: `$stmt->insert_id` → `$conn->lastInsertId()`
- Line 73-74: Removed closes

### 17. api/get_user_reviews.php

**Key changes:**

- Line 29-30: Changed to named parameters `:user_id1` and `:user_id2`
- Line 33-36: Changed to PDO bindValue and fetch
- Line 45-46: Removed closes

### 18. api/get_user_stats.php

**Key changes:**

- Line 34: Table name `Listings` → `"Listings"`
- Line 35-40: Changed to PDO bindValue and fetch
- Line 46-54: Changed wishlist query to PDO
- Line 58-66: Changed reviews query to PDO with two user_id parameters
- Line 69: Removed `$conn->close()`

### 19. api/user_analytics.php & api/get_user_analytics.php

**Key changes (both files):**

- Line 21-25: Changed user query to PDO
- Line 33-37: Changed books query with `"Listings"` table name
- Line 40-44: Changed wishlist query with `"Wishlist"` table name
- Line 63-66: Removed statement closes

### 20. api/upload_profile_picture.php

**Key changes:**

- Line 75: Changed UPDATE query to named parameters
- Line 78: Removed error check
- Line 83-84: Changed to PDO bindValue
- Line 95: Removed error message with `$stmt->error`
- Line 97-98: Removed closes

## SQL Schema Files

### api/init_db.sql

**Changes:**

- Line 4: `Users` → `"Users"` (double quotes for mixed case)
- Line 5: `INT AUTO_INCREMENT` → `SERIAL`
- Line 12: Same for Listings table
- Line 24-25: `INT AUTO_INCREMENT` → `SERIAL` for wishlists
- Line 31: `TINYINT(1)` → `SMALLINT`
- Line 36: `INT AUTO_INCREMENT` → `SERIAL` for ratings

### api/create_messages_table.sql

**Changes:**

- Line 5: `INT AUTO_INCREMENT` → `SERIAL`
- Line 9: `TINYINT(1)` → `SMALLINT`
- Line 13-14: Moved INDEX creation outside CREATE TABLE
- Line 18: `CREATE VIEW` → `CREATE OR REPLACE VIEW`

### api/migrate_listings.sql

**Changes:**

- Line 2: Table name `Listings` → `"Listings"`
- Line 3-7: Removed `AFTER` clauses (PostgreSQL doesn't support column positioning)
- Line 7: Removed `ON UPDATE CURRENT_TIMESTAMP`
- Line 9-21: Added trigger function and trigger for auto-updating updated_at
- Line 24: Table name `Users` → `"Users"`
- Line 25-27: Removed `AFTER` clauses

### api/add_profile_picture_column.sql

**Changes:**

- Line 2: Table name `Users` → `"Users"`
- Line 3: Removed `AFTER password_hash`

## Summary Statistics

- **Total Files Modified:** 25 files
- **PHP Files:** 21 files
- **SQL Files:** 4 files
- **Total Lines Changed:** ~262 lines removed, ~245 lines added
- **Migration Patterns:**
  - mysqli → PDO: 21 instances
  - bind_param → bindValue: 50+ instances
  - insert_id → lastInsertId: 4 instances
  - affected_rows/num_rows → rowCount: 12 instances
  - fetch_assoc → fetch(PDO::FETCH_ASSOC): 25+ instances
  - AUTO_INCREMENT → SERIAL: 5 instances
  - TINYINT → SMALLINT: 2 instances
  - Backticks → Double quotes: 30+ instances
  - LIKE → ILIKE: 9 instances
  - NOW() → CURRENT_TIMESTAMP: 2 instances

## PostgreSQL-Specific Enhancements

1. **Case-insensitive search:** Changed `LIKE` to `ILIKE` in search_listings.php for better user experience
2. **Auto-update trigger:** Added trigger function for updated_at column instead of MySQL's ON UPDATE
3. **Better error handling:** PDO exceptions provide more detailed error information
4. **Prepared statements:** All queries now use named parameters for better readability

---

**Document Generated:** 2025-10-25  
**Total Migration Scope:** Complete application migration from MySQL to PostgreSQL
