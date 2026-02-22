# Git Governance

## Branch Policy
- `main`: production-ready only.
- `codex/<task-name>`: implementation branches.
- Direct pushes to `main` are blocked by branch protection.

## Commit Policy
- Use Conventional Commits:
  - `feat:`
  - `fix:`
  - `chore:`
  - `docs:`
  - `refactor:`
- Keep one logical change per commit.

## Pull Request Policy
- PR template must be completed.
- CI (`.github/workflows/ci.yml`) must pass.
- CODEOWNER review is required for merge.
- Schema changes must include a migration file.

## Branch Protection Setup (GitHub UI)
1. Open repository settings.
2. Add branch protection rule for `main`.
3. Enable:
   - Require pull request before merging
   - Require status checks to pass
   - Require review from code owners
   - Restrict who can push to matching branches

## Daily Hygiene
- Start and end day with:
  - `git status --short`
  - `git fetch --all --prune`
- Resolve or intentionally ignore all untracked artifacts.

