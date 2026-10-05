-- ==============================================================================
-- CINEMATIC BIRTHDAY STORY — COMPLETE SUPABASE DATABASE & STORAGE SCHEMA
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)

-- 1. Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- TABLE: site_content
-- Stores customizable story metadata, hero text, and final reveal copy
-- ==============================================================================
create table if not exists public.site_content (
  id uuid primary key default uuid_generate_v4(),
  section_key text unique not null, -- 'meta' | 'hero' | 'final_reveal'
  draft_data jsonb not null default '{}'::jsonb,
  published_data jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- TABLE: memories
-- Chronological memory timeline milestones and photo cards
-- ==============================================================================
create table if not exists public.memories (
  id text primary key default concat('mem-', extract(epoch from now())),
  title text not null,
  description text default '',
  date_text text default '',
  location text default '',
  image_url text not null,
  video_url text,
  caption_note text,
  sort_order integer default 0,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- TABLE: quiz_questions
-- Interactive personalized trivia quiz questions
-- ==============================================================================
create table if not exists public.quiz_questions (
  id text primary key default concat('quiz-', extract(epoch from now())),
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_option_id text not null,
  explanation text default '',
  reaction_correct text default 'You remembered!',
  reaction_wrong text default 'Close, think back...',
  sort_order integer default 0,
  is_published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- TABLE: wishes
-- Private birthday wishes submitted by the boyfriend
-- ==============================================================================
create table if not exists public.wishes (
  id text primary key default concat('wish-', extract(epoch from now())),
  wish_text text not null,
  x_ratio numeric(5, 4) not null default 0.5,
  y_ratio numeric(5, 4) not null default 0.5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- VIEW: public_stars_view
-- Securely exposes only star sky coordinates without revealing private wish text
-- ==============================================================================
create or replace view public.public_stars_view as
select
  id,
  x_ratio,
  y_ratio,
  created_at
from public.wishes;

-- ==============================================================================
-- TABLE: voice_submissions
-- Encrypted voice notes recorded by the boyfriend for the girlfriend
-- ==============================================================================
create table if not exists public.voice_submissions (
  id text primary key default concat('voice-', extract(epoch from now())),
  storage_path text not null,
  duration_seconds integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- TABLE: media_assets
-- Storage registry for uploaded photos and audio files
-- ==============================================================================
create table if not exists public.media_assets (
  id uuid primary key default uuid_generate_v4(),
  asset_name text not null,
  asset_type text not null check (asset_type in ('image', 'audio', 'video')),
  usage_context text not null check (usage_context in ('hero', 'memory', 'final_reveal', 'scrapbook', 'bg_music', 'general')),
  storage_path text not null,
  public_url text not null,
  file_size bigint default 0,
  mime_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.site_content enable row level security;
alter table public.memories enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.wishes enable row level security;
alter table public.voice_submissions enable row level security;
alter table public.media_assets enable row level security;

-- Public Read Policies
create policy "Allow public read of published site_content"
  on public.site_content for select using (true);

create policy "Allow public read of published memories"
  on public.memories for select using (is_published = true);

create policy "Allow public read of published quiz_questions"
  on public.quiz_questions for select using (is_published = true);

-- Public Insert Policies (Boyfriend can submit wishes and voice recordings)
create policy "Allow public submit wish"
  on public.wishes for insert with check (true);

create policy "Allow public submit voice note"
  on public.voice_submissions for insert with check (true);

-- Authenticated Admin Full Management
create policy "Allow authenticated admin full site_content"
  on public.site_content for all using (auth.role() = 'authenticated');

create policy "Allow authenticated admin full memories"
  on public.memories for all using (auth.role() = 'authenticated');

create policy "Allow authenticated admin full quiz_questions"
  on public.quiz_questions for all using (auth.role() = 'authenticated');

create policy "Allow authenticated admin read wishes"
  on public.wishes for all using (auth.role() = 'authenticated');

create policy "Allow authenticated admin read voice_submissions"
  on public.voice_submissions for all using (auth.role() = 'authenticated');

create policy "Allow authenticated admin full media_assets"
  on public.media_assets for all using (auth.role() = 'authenticated');

-- ==============================================================================
-- STORAGE BUCKETS SETUP
-- ==============================================================================
insert into storage.buckets (id, name, public)
values
  ('voice-submissions', 'voice-submissions', false),
  ('media-assets', 'media-assets', true)
on conflict (id) do nothing;

-- Storage Policies for voice-submissions (private)
create policy "Allow public upload to voice-submissions"
  on storage.objects for insert with check (bucket_id = 'voice-submissions');

create policy "Allow admin read voice-submissions"
  on storage.objects for select using (bucket_id = 'voice-submissions' and auth.role() = 'authenticated');

-- Storage Policies for media-assets (public view, admin upload)
create policy "Allow public view media-assets"
  on storage.objects for select using (bucket_id = 'media-assets');

create policy "Allow admin upload media-assets"
  on storage.objects for insert with check (bucket_id = 'media-assets' and auth.role() = 'authenticated');
