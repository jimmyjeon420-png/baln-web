# BALN Web Stability Master Plan

## Goal
Build a stable operating model for folder structure, Git workflow, and Supabase change management so production updates are predictable and reversible.

## Scope
- Repository structure standardization
- Git quality gates and release discipline
- Supabase schema/function lifecycle governance
- Operational cadence for weekly and monthly checks

## Repository Standard
```
.
├── .github/
│   ├── workflows/
│   ├── CODEOWNERS
│   └── pull_request_template.md
├── docs/
│   └── ops/
├── scripts/
├── supabase/
│   ├── functions/
│   ├── migrations/
│   └── config.toml
└── (web pages)
```

## Phase Plan

### Phase 1: Baseline Hardening (2026-02-22 to 2026-02-23)
- Add `.gitignore` to prevent local artifacts from entering Git.
- Add local/CI validation scripts.
- Add CI workflow for pull requests and pushes to `main`.
- Convert existing SQL changes into migration files.

### Phase 2: Team Workflow Control (2026-02-24 to 2026-02-28)
- Enforce feature branch naming: `codex/<topic>`.
- Require PR merge into `main` (no direct push).
- Enable branch protection in GitHub.
- Use PR template and CODEOWNERS for consistent review.

### Phase 3: Supabase Operational Maturity (2026-03-01 to 2026-03-08)
- Separate `dev`, `staging`, and `prod` Supabase projects.
- Add release checklist for schema and function deploy.
- Schedule monthly backup/restore rehearsal.

## Ongoing Cadence
- Daily: clean `git status`, no unexplained untracked files.
- Weekly: review migrations/functions and secret/cors settings.
- Per release: run validation, deploy with checklist, watch errors for 30 minutes.
- Monthly: backup/restore drill and runbook refresh.

