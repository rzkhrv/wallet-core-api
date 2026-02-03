# Agent workflow (mandatory)

This document is the mandatory workflow for any agent working in this repo. It complements `AGENTS.md` and does not replace it.

## Mandatory process rules
- Before any implementation or code changes, create a task plan file in `tasks/` using the naming format `{index}-task.md` (e.g., `00001-task.md`).
- Task plan files must be written in Russian.
- A task plan is executable only if the first line of the file is exactly `[accepted]`.
- If `[accepted]` is missing, implementing the plan is strictly запрещено.
- Before starting work, re-open the task file and re-read it to confirm `[accepted]` and any edits made after your last read.
- Before execution, explicitly restate the task constraints/scope and do not change files outside the plan.
- Changing or touching files not mentioned in the plan is forbidden unless the task file is updated and re-accepted.
- Before any change, emit a Task Snapshot: task file path, confirmation of `[accepted]`, and an explicit allowlist of files/actions. Without Task Snapshot, any changes are forbidden.
- If there are multiple tasks, create one file per task and keep them as a permanent history of the proposed approach and agreed changes.
- Always start with planning and a task list.
- Every task and subtask must be recorded in task plan files and described.
- If new work is discovered mid-task, create a new task plan file and link it from the parent in Dependencies (e.g., `discovered-from:<parent-task>`). Do not silently expand scope.
- Large tasks must be split into micro-tasks and prioritized.
- Each task plan file must include:
  - Description (context + acceptance criteria).
  - Implementation plan (step-by-step).
  - Dependencies (explicit task file IDs).
- Update task plan files when progress changes (status updates, description changes, or comments).

## Definition of Done (DoD) per task
- Run format: `npm run format`.
- Run lint: `npm run lint`.
- Run tests (full suite):
  - `npm run test`
  - `npm run test:e2e`
- Run build/typecheck: `npm run build`.
- All new/changed endpoints must have automated tests (see below).

If a test cannot run due to missing environment or data, log that in the task plan file and create a follow-up task plan file with the blocker.

## Endpoint test requirement (what it means here)
For this repo, an "endpoint test" means:
- Unit/integration coverage: controller/service specs in `src/**/*.spec.ts` that exercise the endpoint logic and validation paths.
- E2E coverage: `test/*.e2e-spec.ts` using `supertest` against the Nest app (see `test/app.e2e-spec.ts`).

When you add a new endpoint, you must:
- Add or extend the relevant `src/**/*.spec.ts` tests.
- Add or extend an e2e spec in `test/*.e2e-spec.ts` that calls the new route and asserts response shape and status.

## Suggested task plan template
Use this structure for every task plan file:

```
Title: <short, actionable>
Priority: 0-4
Status: planned|in_progress|blocked|done
Description:
  Context: <why this task exists>
  Acceptance:
    - <bullet 1>
    - <bullet 2>
  Plan:
    1) <step 1>
    2) <step 2>
Dependencies: <task file ids or 'none'>
```

## Example: task breakdown for a feature (with deps)
Feature: "Add LTC support" (example only).

```
tasks/00010-task.md
tasks/00011-task.md
tasks/00012-task.md
tasks/00013-task.md
tasks/00014-task.md
```

Example content for `tasks/00011-task.md`:

```
[accepted]
Title: Add LTC wallet-core config
Priority: 1
Status: planned
Description:
  Context: add per-coin wallet-core config.
  Acceptance:
    - ltc-wallet-core.config.ts with wallet-core keys
  Plan:
    1) Add config file and register it in coin config resolver.
Dependencies: none
```

See `docs/COINS.md` for coin-specific steps and `docs/PROJECT.md` for repo layout.
