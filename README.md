# baln-web

BALN landing/admin web project with Supabase edge functions and growth data pipeline.

## Repository Layout
- `index.html`, `meeting-report.html`, `privacy.html`, `terms.html`: public pages
- `admin/`: admin dashboard assets and docs
- `supabase/functions/`: edge function source code
- `supabase/migrations/`: database migration history
- `scripts/`: local and CI validation scripts
- `docs/ops/`: operational governance and runbooks

## Local Validation
Run before commit and before deploy:

```bash
./scripts/validate-repo.sh
```

## Operating Rules
- Database changes must be committed as migration files.
- Secrets and service keys must never be committed.
- Use feature branches (`codex/<task-name>`) and merge by PR.

## References
- Growth setup: `GROWTH_SETUP.md`
- Master plan: `docs/ops/MASTER_PLAN.md`
- Git governance: `docs/ops/GIT_GOVERNANCE.md`
- Supabase governance: `docs/ops/SUPABASE_GOVERNANCE.md`
- Release checklist: `docs/ops/RELEASE_CHECKLIST.md`
