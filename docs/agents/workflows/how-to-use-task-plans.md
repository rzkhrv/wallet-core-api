# Workflow: how to use task plans

## Context
Step-by-step task plan usage.

Canonical rules:
- `AGENTS.md` (hard rules)
- `docs/WORKFLOW.md` (full protocol + DoD + template)

## Steps
1. Create a new task plan file in `tasks/` by copying `tasks/_template-task.md` to `tasks/NNNNN-task.md` (example: `tasks/00001-task.md`).
2. Write the plan in **Russian**. Keep the first line as a draft marker (do **not** add `[accepted]` yourself).
3. Include acceptance criteria, non-goals, risks, rollback, and explicit **allowlists** (files/dirs + commands).
4. Ask the owner to review. Execution is allowed only after the owner sets `[accepted]` as the first non-empty line.
5. Before any changes, re-open and re-read the task file, then emit a **Task Snapshot** (allowlists).
6. If scope changes, stop, update the plan, and wait for re-acceptance.

## Verification
- A task plan file exists in `tasks/` and matches the current scope.
- If implementing: the first non-empty line is `[accepted]` and a Task Snapshot allowlist exists.

## References
- `docs/WORKFLOW.md`
- `tasks/_template-task.md`
- `tasks/`

Last updated: 2026-02-03
