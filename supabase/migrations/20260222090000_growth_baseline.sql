begin;

create extension if not exists pgcrypto;

create table if not exists public.landing_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_name text not null check (length(trim(event_name)) > 0),
  session_id text,
  page_path text,
  page_url text,
  referrer_host text,
  user_agent text,
  properties jsonb not null default '{}'::jsonb,
  experiments jsonb not null default '{}'::jsonb,
  utm jsonb not null default '{}'::jsonb
);

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null check (length(trim(email)) > 0),
  channel text not null default 'remote',
  source text not null default 'landing_waitlist',
  consent boolean not null default false,
  experiments jsonb not null default '{}'::jsonb,
  utm jsonb not null default '{}'::jsonb
);

create unique index if not exists waitlist_signups_email_unique
on public.waitlist_signups ((lower(email)));

create index if not exists landing_events_event_name_idx
on public.landing_events (event_name, created_at desc);

create index if not exists waitlist_signups_created_at_idx
on public.waitlist_signups (created_at desc);

commit;

