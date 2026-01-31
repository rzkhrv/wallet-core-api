# Repo map

## Context
Quick navigation guide to the main directories and files in this repo.

## Goal
Let an agent find the right place to make changes without guessing.

## Steps
1. Start at `src/main.ts` and `src/app.module.ts` for entry points.
2. Use `src/coins/` for API-level coin modules (controllers/services/DTOs).
3. Use `src/adapter/` for wallet-core adapter implementations.
4. Use `test/` for e2e tests and `src/**/*.spec.ts` for unit/integration tests.
5. Avoid editing generated output in `dist/` and dependencies in `node_modules/`.

## Key paths
- Entry points: `src/main.ts`, `src/app.module.ts`
- API modules: `src/coins/<coin>/`
- Adapters: `src/adapter/coins/<coin>/`
- Shared: `src/common/`
- Tests: `src/**/*.spec.ts`, `test/*.e2e-spec.ts`
- Docs: `docs/PROJECT.md`, `docs/COINS.md`, `docs/WORKFLOW.md`
- Generated: `dist/` (do not edit), `node_modules/` (do not edit)
- Task tracking: `.beads/`

## Verification
- You can locate the controller/service/adapter for an existing coin (e.g., BTC).
- You can locate the e2e test file `test/app.e2e-spec.ts`.

## References
- `src/`
- `test/`
- `docs/`
- `.beads/`

Last updated: 2026-01-31
