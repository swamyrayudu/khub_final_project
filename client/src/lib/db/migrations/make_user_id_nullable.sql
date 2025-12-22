-- Migration: Make user_id nullable in messages table
-- This allows system notifications to be stored without requiring a user record

ALTER TABLE messages ALTER COLUMN user_id DROP NOT NULL;
