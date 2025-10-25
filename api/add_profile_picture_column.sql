-- Migration to add profile_picture column to Users table if it doesn't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255);
