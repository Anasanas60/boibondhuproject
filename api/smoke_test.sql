-- smoke_test.sql
-- Inserts a user and a listing (using CTE to return the new user id), updates the listing, and selects the record to show updated_at changed.

WITH ins_user AS (
  INSERT INTO users (name, campus_email, password_hash)
  VALUES ('Smoke Test User', 'smoke@example.com', 'hash')
  RETURNING user_id
)
INSERT INTO listings (seller_id, title, author, course_code, price, "condition")
SELECT user_id, 'Smoke Listing', 'Smoke Author', 'SM101', 9.99, 'good' FROM ins_user
RETURNING listing_id, created_at, updated_at;

-- Update the price to trigger updated_at
UPDATE listings SET price = 12.50 WHERE listing_id = (SELECT MAX(listing_id) FROM listings);

-- Show the most recent listing's timestamps
SELECT listing_id, created_at, updated_at FROM listings ORDER BY listing_id DESC LIMIT 1;
