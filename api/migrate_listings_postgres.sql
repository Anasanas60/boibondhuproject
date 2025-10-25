-- api/migrate_listings_postgres.sql
-- Migration adapted for PostgreSQL from migrate_listings.sql
-- Notes:
--  - Removed MySQL `AFTER` clauses.
--  - `updated_at` auto-update implemented via trigger below.

-- Add columns to listings
ALTER TABLE listings
    ADD COLUMN IF NOT EXISTS edition VARCHAR(50),
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'available',
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add columns to users
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255),
    ADD COLUMN IF NOT EXISTS campus VARCHAR(100),
    ADD COLUMN IF NOT EXISTS year VARCHAR(20);

-- Create function and trigger to auto-update updated_at on row updates
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger WHERE tgname = 'listings_set_updated_at_trigger'
    ) THEN
        CREATE TRIGGER listings_set_updated_at_trigger
        BEFORE UPDATE ON listings
        FOR EACH ROW
        EXECUTE PROCEDURE set_updated_at();
    END IF;
END;
$$;
