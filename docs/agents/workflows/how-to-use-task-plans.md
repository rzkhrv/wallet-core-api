# Workflow: how to use task plans

## Context
Step-by-step task plan usage. The canonical rules live in `docs/WORKFLOW.md`.

## Goal
Provide concrete steps for task plan files; if this file conflicts with `docs/WORKFLOW.md`, follow `docs/WORKFLOW.md`.

## Steps
1. Create a new task plan file in `tasks/` using `{index}-task.md`.
2. Write the plan in Russian and ensure the first line is exactly `[accepted]` before execution.
3. Fill in Title, Priority, Status, Description (Context/Acceptance), Plan, Dependencies.
4. Before making changes, re-open the file, confirm `[accepted]`, and emit the Task Snapshot.
5. If scope changes, update the plan; if new work is discovered, create a new task plan file and link it in Dependencies.
6. When done, set Status to done and record any skipped checks with reasons.

## Verification
- A task plan file exists in `tasks/` with `[accepted]` and current scope.
- Dependencies are explicit and up to date.

## References
- `docs/WORKFLOW.md`
- `tasks/`

Last updated: 2026-02-02
