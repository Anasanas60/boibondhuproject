-- Migration to add missing columns to Listings table
ALTER TABLE "Listings"
ADD COLUMN edition VARCHAR(50),
ADD COLUMN description TEXT,
ADD COLUMN status VARCHAR(20) DEFAULT 'available',
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Create trigger to update updated_at timestamp
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

-- Also add profile_picture column to Users table if it doesn't exist
ALTER TABLE "Users"
ADD COLUMN profile_picture VARCHAR(255),
ADD COLUMN campus VARCHAR(100),
ADD COLUMN year VARCHAR(20);
