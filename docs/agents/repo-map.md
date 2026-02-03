# Repo map

## Context
Quick navigation guide to the main directories and files in this repo.

## Goal
Let an agent find the right place to make changes without guessing.

## Steps
1. Start at `src/main.ts` and `src/app.module.ts` for entry points.
2. Use `src/coins/` for API-level coin modules (controllers/services/DTOs).
3. Use `src/coins/<coin>/adapter/` for coin-specific wallet-core adapters and `src/common/wallet-core/` for shared wallet-core wrappers.
4. Use `test/` for e2e tests and `src/**/*.spec.ts` for unit/integration tests.
5. Avoid editing generated output in `dist/` and dependencies in `node_modules/`.

## Key paths
- Entry points: `src/main.ts`, `src/app.module.ts`
- API modules: `src/coins/<coin>/`
- Coin adapters: `src/coins/<coin>/adapter/`
- Shared wallet-core adapter: `src/common/wallet-core/`
- Shared mnemonic adapter: `src/common/mnemonic/adapter/`
- Shared: `src/common/`
- Tests: `src/**/*.spec.ts`, `test/*.e2e-spec.ts`
- Docs: `docs/PROJECT.md`, `docs/COINS.md`, `docs/WORKFLOW.md`
- Generated: `dist/` (do not edit), `node_modules/` (do not edit)
- Task plans: `tasks/` (mandatory before implementation; `{index}-task.md` in Russian; must start with `[accepted]` to allow execution; re-read and respect scope before work; Task Snapshot required)

## Verification
- You can locate the controller/service/adapter for an existing coin (e.g., BTC).
- You can locate the e2e test file `test/app.e2e-spec.ts`.

## References
- `src/`
- `test/`
- `docs/`

Last updated: 2026-02-02
