# Agent workflow (mandatory)

This document is the mandatory workflow for any agent working in this repo. It complements `AGENTS.md` and does not replace it.

## Mandatory process rules
- Always start with planning and a task list.
- Every task and subtask must be recorded in BD (beads) and described.
- If new work is discovered mid-task, create a new BD task and link it (`discovered-from:<parent-id>`). Do not silently expand scope.
- Large tasks must be split into micro-tasks and prioritized.
- Each BD task must include:
  - Description (context + acceptance criteria).
  - Implementation plan (step-by-step).
  - Dependencies (explicit BD task IDs).
- Update BD tasks when progress changes (status updates, description changes, or comments).

## Definition of Done (DoD) per task
- Run format: `npm run format`.
- Run tests (full suite):
  - `npm run test`
  - `npm run test:e2e`
- All new/changed endpoints must have automated tests (see below).

If a test cannot run due to missing environment or data, log that in the BD task description and create a follow-up task with the blocker.

## Endpoint test requirement (what it means here)
For this repo, an "endpoint test" means:
- Unit/integration coverage: controller/service specs in `src/**/*.spec.ts` that exercise the endpoint logic and validation paths.
- E2E coverage: `test/*.e2e-spec.ts` using `supertest` against the Nest app (see `test/app.e2e-spec.ts`).

When you add a new endpoint, you must:
- Add or extend the relevant `src/**/*.spec.ts` tests.
- Add or extend an e2e spec in `test/*.e2e-spec.ts` that calls the new route and asserts response shape and status.

## Suggested BD task template
Use this structure for every BD task (description field):

```
Title: <short, actionable>
Type: task|feature|bug|docs
Priority: 0-4
Description:
  Context: <why this task exists>
  Acceptance:
    - <bullet 1>
    - <bullet 2>
  Plan:
    1) <step 1>
    2) <step 2>
Dependencies: <bd-ids or 'none'>
```

## Example: BD task breakdown for a feature (with deps)
Feature: "Add LTC support" (example only).

Commands (all should include `--json`):

```
bd create "Add LTC support" --description="Context: add LTC endpoints and adapters. Acceptance: endpoints + tests + docs. Plan: split into subtasks. Dependencies: none" -t epic -p 1 --json

bd create "Add LTC coin config" --description="Context: introduce LTC in enum/config. Acceptance: enum + config entry. Plan: update coin enum + coin.config. Dependencies: none" -t task -p 1 --json

bd create "Implement LTC adapters" --description="Context: wallet-core adapter layer. Acceptance: address + transaction adapters with DTOs. Plan: create adapter files + DTOs + AdapterModule wiring. Dependencies: bd-<config-id>" -t task -p 1 --json

bd create "Implement LTC controllers/services" --description="Context: API layer. Acceptance: controllers/services + DTOs + CoinsModule wiring. Plan: create module/controllers/services + DTOs. Dependencies: bd-<config-id>, bd-<adapter-id>" -t task -p 1 --json

bd create "Add LTC tests" --description="Context: endpoint coverage. Acceptance: unit/integration + e2e tests. Plan: add specs in src + test/*.e2e-spec.ts. Dependencies: bd-<api-id>" -t task -p 1 --json
```

When progress changes, update tasks (status, description, or comments):

```
bd update bd-123 --status in_progress --json
bd update bd-123 --description="Context: ... Plan updated to include ..." --json
bd close bd-123 --reason "Completed" --json
```

See `docs/COINS.md` for coin-specific steps and `docs/PROJECT.md` for repo layout.
