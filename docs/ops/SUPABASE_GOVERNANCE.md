# Supabase Governance

## Core Rules
- Schema changes are file-first in `supabase/migrations`.
- Dashboard hotfix SQL is allowed only for incidents and must be backfilled into migration files on the same day.
- Edge function code and DB migration are reviewed in one PR when tightly coupled.

## Environment Model
- `dev`: development and experiments
- `staging`: pre-production verification
- `prod`: public traffic

Keep separate project refs and API keys per environment.

## Migration Workflow
1. Create migration file in `supabase/migrations` (timestamp prefix).
2. Apply to development project.
3. Verify app/admin behavior.
4. Promote to staging.
5. Promote to production with release checklist.

## Function Deployment Workflow
1. Validate locally:
   - `./scripts/validate-repo.sh`
2. Deploy targeted function:
   - `supabase functions deploy landing-events --no-verify-jwt`
   - `supabase functions deploy waitlist-signup --no-verify-jwt`
3. Confirm CORS and secrets:
   - `ALLOWED_ORIGINS`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Verify production event ingestion.

## Security Baseline
- Never commit service-role keys.
- Keep allowed origins strict (`https://baln.app` and required local dev origins only).
- Use server-side insert paths for waitlist/events.
- Add rate limiting or CAPTCHA before scaling public waitlist campaigns.

## Monthly Reliability Checklist
- Validate backup availability.
- Run restore drill on non-production project.
- Review slow queries and table growth.
- Audit function error logs and retry strategy.

