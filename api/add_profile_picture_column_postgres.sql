-- api/add_profile_picture_column_postgres.sql
-- Postgres-safe migration to add profile_picture column if missing

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255);
