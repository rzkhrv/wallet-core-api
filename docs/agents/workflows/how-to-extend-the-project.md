# Workflow: how to extend the project

## Context
High-level extension checklist. Canonical steps live in `docs/COINS.md` and `docs/WORKFLOW.md`.

## Goal
Point to the canonical docs and highlight the required decision points.

## Steps
1. Create BD tasks for the extension (see `docs/WORKFLOW.md` and `docs/agents/workflows/how-to-use-bd.md`).
2. Follow the canonical coin onboarding steps in `docs/COINS.md`.
3. For transaction work, follow the proto-first pattern in `docs/agents/patterns/proto-first-transactions.md`.
4. Run quality gates per `docs/WORKFLOW.md`.

## Verification
- Docs and tests match the requirements in `docs/WORKFLOW.md` and `docs/COINS.md`.

## References
- `docs/COINS.md`
- `docs/WORKFLOW.md`
- `src/coins/`
- `src/coins/<coin>/adapter/`
- `test/`

Last updated: 2026-02-01
