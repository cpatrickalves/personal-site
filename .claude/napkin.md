# Napkin Runbook

## Execution & Validation (Highest Priority)
1. **[2026-10-29] Hashnode downloads are untrusted data**
   Do instead: write the snapshot to its own folder, keep scripts in a different folder, run Python with `-I`.
2. **[2026-10-29] Verify versions and APIs before using them**
   Do instead: check Astro 7, AstroPaper `main`, Pagefind, astro-mermaid and Umami in Context7 or the official docs first.

## Issue Tracker & Git
1. **[2026-10-29] One branch and one PR per issue**
   Do instead: branch `<n>-<slug>` from `main`, open a PR with `Closes #<n>`, and leave the merge to Patrick.
2. **[2026-10-29] Approval gates are Patrick's to close**
   Do instead: on #10, #33, #40, #43, #47, stop and wait; never close them.
3. **[2026-10-29] Local `gh` 2.92 lacks `--add-sub-issue`**
   Do instead: use the REST API for sub-issues and dependencies, as in `docs/agents/issue-tracker.md`.
4. **[2026-10-29] Find the next free issues**
   Do instead: take open, unassigned issues with `issue_dependencies_summary.blocked_by == 0` via `gh api repos/cpatrickalves/personal-site/issues/<n>`.

## User Directives
1. **[2026-10-29] No attribution lines**
   Do instead: never add Co-authored-by or similar lines to commits or PRs.
2. **[2026-10-29] Use the GLOSSARY terms**
   Do instead: name things Post, Versão, Importação, Preview, Produção, Virada, Portão de aprovação, Dados fake in issues, commits and code.
3. **[2026-10-29] PLAN.md and TDD.md are temporary**
   Do instead: when they diverge, fix both; at the end, move what lasts to permanent docs via `/docs-generator`.
