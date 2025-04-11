-- Add latitude and longitude columns to games table
ALTER TABLE games
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION; 