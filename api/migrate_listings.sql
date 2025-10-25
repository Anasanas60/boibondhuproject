-- Migration to add missing columns to Listings table
ALTER TABLE Listings
ADD COLUMN edition VARCHAR(50) AFTER course_code,
ADD COLUMN description TEXT AFTER `condition`,
ADD COLUMN status VARCHAR(20) DEFAULT 'available' AFTER description,
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER status,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Also add profile_picture column to Users table if it doesn't exist
ALTER TABLE Users
ADD COLUMN profile_picture VARCHAR(255) AFTER password_hash,
ADD COLUMN campus VARCHAR(100) AFTER profile_picture,
ADD COLUMN year VARCHAR(20) AFTER campus;
