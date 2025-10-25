-- Combined PostgreSQL migration for boibondhu project
-- Contains schema (users, listings, wishlists, ratings, messages), indexes, views, and triggers
-- Run on a fresh Postgres DB (psql -U <user> -d <db> -f migration_postgres_combined.sql)

BEGIN;

-- 1) Users
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  campus_email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255),
  campus VARCHAR(100),
  year VARCHAR(20)
);

-- 2) Listings
CREATE TABLE IF NOT EXISTS listings (
  listing_id SERIAL PRIMARY KEY,
  seller_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  course_code VARCHAR(50) NOT NULL,
  edition INT,
  price NUMERIC(10,2) NOT NULL,
  "condition" VARCHAR(50) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3) Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  wishlist_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  title_keyword VARCHAR(255) NOT NULL,
  author_keyword VARCHAR(255),
  course_code_keyword VARCHAR(50),
  edition INT,
  alert_sent BOOLEAN DEFAULT FALSE
);

-- 4) Ratings
CREATE TABLE IF NOT EXISTS ratings (
  rating_id SERIAL PRIMARY KEY,
  seller_id INT NOT NULL REFERENCES users(user_id),
  buyer_id INT NOT NULL REFERENCES users(user_id),
  listing_id INT NOT NULL REFERENCES listings(listing_id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5) Messages
CREATE TABLE IF NOT EXISTS messages (
  message_id SERIAL PRIMARY KEY,
  sender_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  receiver_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for messages and listings lookups
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages (sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at);
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings (seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings (created_at);

-- 6) Conversations view (adapted for Postgres)
CREATE OR REPLACE VIEW conversations AS
SELECT
  LEAST(sender_id, receiver_id) AS user1_id,
  GREATEST(sender_id, receiver_id) AS user2_id,
  MAX(created_at) AS last_message_time,
  COUNT(*) AS total_messages,
  SUM(CASE WHEN is_read = FALSE AND receiver_id = LEAST(sender_id, receiver_id) THEN 1 ELSE 0 END) AS unread_count_user1,
  SUM(CASE WHEN is_read = FALSE AND receiver_id = GREATEST(sender_id, receiver_id) THEN 1 ELSE 0 END) AS unread_count_user2
FROM messages
GROUP BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id);

-- 7) Trigger: update updated_at on listings for UPDATE operations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_updated_at_listings') THEN
    CREATE TRIGGER trg_update_updated_at_listings
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

COMMIT;

-- End of migration_postgres_combined.sql
