# Workflow: how to extend the project

## Context
Adding a new coin or a new API surface in this NestJS wallet-core service.

## Goal
Introduce new functionality without breaking conventions, tests, or adapter isolation.

## Steps
1. Create Beads tasks for the extension (feature epic + subtasks).
2. Add per-coin wallet-core configuration:
   - Create `src/coins/<coin>/*-wallet-core.config.ts` with coin type, purpose, and derivation keys.
3. Implement adapters in `src/coins/<coin>/adapter/`.
   - Keep wallet-core access inside adapters.
   - Wrap failures with `AdapterError`.
   - Release wallet-core objects in `finally` via `.delete()`.
   - Keep build and sign flows separate (build endpoints must not require private keys).
4. Implement API module in `src/coins/<coin>/`.
   - Controllers use Swagger decorators.
   - Services map API DTOs to adapter DTOs.
5. Register modules/adapters:
   - `src/coins/coins.module.ts`
   - Register coin adapters in `<coin>.module.ts` (no AdapterModule changes required).
6. Add tests:
   - Unit/integration specs in `src/coins/<coin>/**/*.spec.ts`.
   - E2E coverage in `test/*.e2e-spec.ts`.
7. Update docs:
   - `docs/COINS.md` for coin support rules.
   - `docs/agents/*` for any new knowledge or workflows.
8. Run quality gates:
   ```bash
   npm run format
   npm run lint
   npm run test
   npm run test:e2e
   npm run build
   ```

## Verification
- New endpoints respond as expected and are covered by unit/integration + e2e tests.
- `npm run build` completes without errors.
- Docs updated to reflect new behavior.

## References
- `docs/COINS.md`
- `docs/WORKFLOW.md`
- `src/coins/`
- `src/coins/<coin>/adapter/`
- `test/`

Last updated: 2026-02-01
