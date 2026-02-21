# baln Growth Pipeline Setup

## 1) Frontend config
Create `/Users/nicenoodle/baln-web/baln-config.js` (not committed) from the example file:

```js
window.BALN_CONFIG = {
  appStoreUrl: "",
  eventsEndpoint: "https://YOUR_PROJECT.supabase.co/functions/v1/landing-events",
  waitlistEndpoint: "https://YOUR_PROJECT.supabase.co/functions/v1/waitlist-signup",
  publicApiKey: "SUPABASE_ANON_KEY",
  waitlistBaseCount: 120
};
```

Then load it before the inline script in `/Users/nicenoodle/baln-web/index.html`:

```html
<script src="./baln-config.js"></script>
```

`index.html` already includes this script tag. You only need to create `baln-config.js`.

## 2) Supabase tables

```sql
create table if not exists public.landing_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  event_name text not null,
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
  email text not null,
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
```

## 3) Edge Function contracts

`landing-events` request body:

```json
{
  "event_name": "landing_view",
  "created_at": "2026-02-21T09:10:00.000Z",
  "session_id": "sid_xxx",
  "page_path": "/",
  "page_url": "https://baln.app/",
  "referrer_host": "google.com",
  "user_agent": "...",
  "properties": {},
  "experiments": {"hero_copy":"a","cta_copy":"b"},
  "utm": {"source":"google","medium":"cpc","campaign":"launch"}
}
```

`waitlist-signup` request body:

```json
{
  "email": "user@example.com",
  "consent": true,
  "created_at": "2026-02-21T09:10:00.000Z",
  "source": "landing_waitlist",
  "experiments": {"hero_copy":"a","cta_copy":"b"},
  "utm": {"source":"google","medium":"cpc","campaign":"launch"}
}
```

## 4) Admin Growth tab
`/Users/nicenoodle/baln-web/admin/index.html` reads:
- remote: `landing_events`, `waitlist_signups`
- local fallback: browser storage keys `baln_local_events`, `baln_local_waitlist`

If remote tables are missing, the Growth tab still renders using local fallback data.

## 5) Deploy Edge Functions

From `/Users/nicenoodle/baln-web`:

```bash
supabase functions deploy landing-events --no-verify-jwt
supabase functions deploy waitlist-signup --no-verify-jwt
```

Optional environment variables:

```bash
supabase secrets set ALLOWED_ORIGINS="https://baln.app,http://localhost:3000,http://localhost:5173"
```
