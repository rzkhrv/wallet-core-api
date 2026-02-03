# Runbook: task plan issues

## Context
Task plan files are missing, not accepted, or out of sync with current scope.

## Symptoms
- Task plan file is missing or does not start with `[accepted]`.
- Task Snapshot is missing or lists the wrong files/actions.
- Scope changes are not reflected in the task plan file.

## Steps
1. Locate the task plan file under `tasks/` and confirm the first line is exactly `[accepted]`.
2. Ensure the plan includes Title, Priority, Status, Description (Context/Acceptance), Plan, Dependencies.
3. Update the Task Snapshot allowlist to match current scope.
4. If new work is discovered, create a new task plan file and link it in Dependencies.
5. Re-read the task plan file before resuming changes.

## Verification
- The task plan file in `tasks/` starts with `[accepted]` and matches current scope.
- Dependencies and status are explicit and up to date.

## References
- `docs/WORKFLOW.md`
- `tasks/`

Last updated: 2026-02-02
