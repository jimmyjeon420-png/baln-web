# Release Checklist

## Pre-Merge
- [ ] Branch is `codex/<task-name>`
- [ ] PR summary and deploy notes are complete
- [ ] `./scripts/validate-repo.sh` passed
- [ ] New DB changes are in `supabase/migrations`
- [ ] No secrets in diff

## Pre-Deploy
- [ ] Confirm target environment (`staging` or `prod`)
- [ ] Confirm Supabase project ref and secrets
- [ ] Confirm required migrations are ordered and ready
- [ ] Confirm rollback plan:
  - previous function version
  - compensating SQL script if needed

## Deploy
- [ ] Apply migrations
- [ ] Deploy edge functions
- [ ] Verify admin Growth tab reads remote data
- [ ] Verify landing page event + waitlist write paths

## Post-Deploy (30 minutes)
- [ ] Monitor function error logs
- [ ] Check insert volume in `landing_events` and `waitlist_signups`
- [ ] Confirm no user-visible regression on `/` and `/admin/`
- [ ] Record release notes

