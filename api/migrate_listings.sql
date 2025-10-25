-- Migration to add missing columns to Listings table
ALTER TABLE Listings
ADD COLUMN edition VARCHAR(50),
ADD COLUMN description TEXT,
ADD COLUMN status VARCHAR(20) DEFAULT 'available',
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Also add profile_picture column to Users table if it doesn't exist
ALTER TABLE Users
ADD COLUMN profile_picture VARCHAR(255),
ADD COLUMN campus VARCHAR(100),
ADD COLUMN year VARCHAR(20);

-- Create trigger to update updated_at column on row update (Postgres replacement for ON UPDATE CURRENT_TIMESTAMP)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = CURRENT_TIMESTAMP;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_trigger WHERE tgname = 'trg_update_updated_at_listings'
	) THEN
		CREATE TRIGGER trg_update_updated_at_listings
		BEFORE UPDATE ON Listings
		FOR EACH ROW
		EXECUTE FUNCTION update_updated_at_column();
	END IF;
END;
$$;
