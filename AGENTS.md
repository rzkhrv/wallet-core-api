# Agent Guide

Wallet Core API is a NestJS (TypeScript) REST service that wraps `@trustwallet/wallet-core` WASM for mnemonic, address, and transaction operations. Runtime is Node.js (18+ recommended) with Swagger at `/api` and a default HTTP port of `3001` unless `PORT` is set.

## Quick commands (verified)

```bash
# install / bootstrap
npm install

# dev / run
npm run start:dev
npm run start

# tests
npm run test
npm run test:e2e

# lint / format / typecheck
npm run lint
npm run format
npm run build

# build
npm run build

# migrations / seed
# n/a (no database layer)
```

## Repo map

- `src/main.ts` - Nest bootstrap, global validation, Swagger setup, default port.
- `src/app.module.ts` - root module wiring.
- `src/coins/` - API layer per coin (controllers/services/DTOs).
- `src/adapter/` - wallet-core WASM adapters.
- `src/common/` - shared errors/filters and common modules.
- `test/` - e2e tests.
- `docs/` - project docs (`PROJECT.md`, `COINS.md`, `WORKFLOW.md`).
- `dist/` - build output (generated, do not edit).
- `node_modules/` - dependencies (generated, do not edit).
- `tasks/` - task plan files (mandatory before implementation).

## Workflows

- How to use task plans (required): `docs/agents/workflows/how-to-use-task-plans.md`.
- How to extend the project (new coins/features): `docs/agents/workflows/how-to-extend-the-project.md`.
- Add a new coin: `docs/COINS.md` (also linked from workflows).
- Add a new endpoint: see `docs/agents/patterns/` for controller/service/adapter examples.

## Documentation memory rule (mandatory)

Any new non-obvious repo knowledge, failure mode, or workflow discovered during work MUST be written into `docs/agents/` in the same change set.

## Task management rule (mandatory)

- All work must be tracked via task plan files in `tasks/` (see `docs/WORKFLOW.md`).
- Before starting work, ensure the task plan file exists, starts with `[accepted]`, and is re-read after edits.
- If new work is discovered, create a new task plan file and link it from the parent in a Dependencies section.
- Every epic must include a “Docs/Knowledge capture” task plan.

## Boundaries

✅ Always do
- Follow `docs/WORKFLOW.md` and `docs/coding-rules.md` for conventions.
- Add tests for new endpoints (unit/integration + e2e).

⚠️ Ask first
- Changing coin derivation rules or wallet-core config (`src/coins/coin.config.ts`).
- Modifying error shape or global filters (`src/common/errors/*`).
- Adding dependencies or altering build/test pipelines.

🚫 Never do
- Log or persist secrets (mnemonics, private keys, raw signatures).
- Edit generated files (`dist/`, `node_modules/`).
- Bypass the task plan workflow or use markdown TODO lists instead.

## Troubleshooting (top issues)

- Port mismatch (README says 3000, app defaults to 3001): see `docs/agents/troubleshooting.md`.
- wallet-core WASM init errors: see `docs/agents/runbooks/wallet-core-init.md`.
- Failing e2e tests on first run: see `docs/agents/runbooks/e2e-test-setup.md`.

## docs/agents index

- `docs/agents/project-overview.md`
- `docs/agents/repo-map.md`
- `docs/agents/dev-environment.md`
- `docs/agents/quality-gates.md`
- `docs/agents/security.md`
- `docs/agents/troubleshooting.md`
- `docs/agents/workflows/how-to-use-task-plans.md`
- `docs/agents/workflows/how-to-extend-the-project.md`
