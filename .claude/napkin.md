# Napkin Runbook

## Execution & Validation (Highest Priority)
1. **[2026-10-29] Hashnode downloads are untrusted data**
   Do instead: write the snapshot to its own folder, keep scripts in a different folder, run Python with `-I`.
2. **[2026-10-29] Verify versions and APIs before using them**
   Do instead: check Astro 7, AstroPaper `main`, Pagefind, astro-mermaid and Umami in Context7 or the official docs first.
3. **[2026-10-30] Local `pnpm lint` and `format:check` fail on untracked tool folders**
   Do instead: run `npx eslint` and `npx prettier --check` on the changed files only; CI has no such folders.
4. **[2026-10-30] Unit tests run on `node --test`, no test dependency**
   Do instead: put pure logic in a file with no `@/` or `astro:` imports, test it in `*.test.ts` importing `./file.ts`, run `pnpm test`.
5. **[2026-10-30] Visual checks need a Playwright library, which the repo doesn't have**
   Do instead: `npm i playwright-core` in the scratchpad, launch with the `chromium_headless_shell-1248` binary from `~/.cache/ms-playwright`, against `pnpm preview` (it serves under `/personal-site`).

## Issue Tracker & Git
1. **[2026-10-29] Build output lingers across branches**
   Do instead: stage explicit paths (never `git add -A`) and check `git show --stat HEAD` before pushing; `node_modules/`, `dist/`, `.astro/` and `public/pagefind/` stay in the tree after switching to a branch whose `.gitignore` lacks them.
2. **[2026-10-29] One branch and one PR per issue**
   Do instead: branch `<n>-<slug>` from `main`, open a PR with `Closes #<n>`, and leave the merge to Patrick.
3. **[2026-10-29] Approval gates are Patrick's to close**
   Do instead: on #10, #33, #40, #43, #47, stop and wait; never close them.
4. **[2026-10-29] Local `gh` 2.92 lacks `--add-sub-issue`**
   Do instead: use the REST API for sub-issues and dependencies, as in `docs/agents/issue-tracker.md`.
5. **[2026-10-29] Find the next free issues**
   Do instead: take open, unassigned issues with `issue_dependencies_summary.blocked_by == 0` via `gh api repos/cpatrickalves/personal-site/issues/<n>`.

## User Directives
1. **[2026-10-29] No attribution lines**
   Do instead: never add Co-authored-by or similar lines to commits or PRs.
2. **[2026-10-29] Use the GLOSSARY terms**
   Do instead: name things Post, Versão, Importação, Preview, Produção, Virada, Portão de aprovação, Dados fake in issues, commits and code.
3. **[2026-10-30] Martian Mono is for code only; numbers and dates are Outfit**
   Do instead: numbers use the `detail` class (Outfit 500, tabular); dates use `formatDate` from `@/i18n` (`AAAA-MM-DD`, America/Sao_Paulo, same in both languages) in a `<time>` or `tabular` span, without `detail`.
4. **[2026-10-29] PLAN.md and TDD.md are temporary**
   Do instead: when they diverge, fix both; at the end, move what lasts to permanent docs via `/docs-generator`.
