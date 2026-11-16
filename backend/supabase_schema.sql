-- =========================================================
-- Supabase Schema for Digital Wellness Resource Hub
-- Paste and run this script in the Supabase SQL Editor.
-- =========================================================

-- Enable pgvector extension for AI semantic search if needed
CREATE EXTENSION IF NOT EXISTS vector;

-- Drop old tables if re-initializing (safe for fresh project)
-- DROP TABLE IF EXISTS student_submissions CASCADE;
-- DROP TABLE IF EXISTS setup_guides CASCADE;
-- DROP TABLE IF EXISTS wellness_resources CASCADE;

-- 1. Wellness Resources Table
CREATE TABLE IF NOT EXISTS wellness_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    tagline TEXT,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    developer_or_team VARCHAR(255),
    official_url TEXT,
    repository_url TEXT,
    platforms JSONB NOT NULL DEFAULT '[]'::jsonb,
    pricing_type VARCHAR(100) NOT NULL,
    price_details TEXT NOT NULL,
    purpose TEXT NOT NULL,
    privacy_rating VARCHAR(10) NOT NULL,
    privacy_details TEXT NOT NULL,
    accessibility_features TEXT NOT NULL,
    limitations TEXT NOT NULL,
    verified_date VARCHAR(50) NOT NULL DEFAULT '2026-11-16',
    student_rating NUMERIC(2, 1) DEFAULT 4.8,
    embedding vector(768)
);

CREATE INDEX IF NOT EXISTS idx_wellness_resources_slug ON wellness_resources(slug);
CREATE INDEX IF NOT EXISTS idx_wellness_resources_category ON wellness_resources(category);
CREATE INDEX IF NOT EXISTS idx_wellness_resources_pricing ON wellness_resources(pricing_type);

-- 2. Setup Guides Table
CREATE TABLE IF NOT EXISTS setup_guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    target_platforms JSONB NOT NULL DEFAULT '[]'::jsonb,
    estimated_minutes INTEGER DEFAULT 10,
    difficulty VARCHAR(50) DEFAULT 'Beginner',
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    key_takeaways JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_setup_guides_slug ON setup_guides(slug);

-- 3. Student Submissions & Feedback Table
CREATE TABLE IF NOT EXISTS student_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name VARCHAR(255) DEFAULT 'Anonymous Student',
    email VARCHAR(255),
    submission_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    media_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    status VARCHAR(50) DEFAULT 'pending'
);

-- Supabase RLS (Row Level Security) - Permissive read for public display
ALTER TABLE wellness_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE setup_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_submissions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read wellness_resources') THEN
        CREATE POLICY "Public can read wellness_resources" ON wellness_resources FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can read setup_guides') THEN
        CREATE POLICY "Public can read setup_guides" ON setup_guides FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert submissions') THEN
        CREATE POLICY "Public can insert submissions" ON student_submissions FOR INSERT WITH CHECK (true);
    END IF;
END $$;

