# Runbook: task plan issues

## Context
Task plan files are missing, not accepted, malformed, or out of sync with the current scope.

## Symptoms
- Task plan file is missing or does not start with `[accepted]` (first non-empty line).
- Task Snapshot is missing or lists the wrong files/actions.
- Scope changes are not reflected in the task plan file.
- The task file exists but is missing required sections (acceptance criteria, allowlists, rollback, etc.).

## Steps
1. Locate the active task plan file under `tasks/` (format: `NNNNN-task.md`).
2. Confirm the first non-empty line is exactly `[accepted]` (owner-only change). If not accepted: stop implementation.
3. If the task file is missing or malformed: copy `tasks/_template-task.md` to a new `tasks/NNNNN-task.md` and fill it in (in Russian).
4. Verify the task file contains (at minimum):
   - Title
   - Priority + Status
   - Description (Context)
   - Acceptance criteria (checkbox list)
   - Plan (ordered steps)
   - Scope allowlists: files/dirs + commands/actions
   - Testing
   - Risks
   - Rollback
   - Open questions
   - Execution log
   - Dependencies (or `none`)
5. Update allowlists (Task Snapshot) to match the real scope. If a new file/command is needed: stop, update the plan, and get re-acceptance.
6. Re-read the task file before resuming implementation, then proceed under the allowlists only.

## Verification
- The active task plan file in `tasks/` starts with `[accepted]` and matches current scope.
- Allowlisted files/dirs and commands/actions match what is actually required.
- Dependencies and status are explicit and up to date.

## References
- `AGENTS.md`
- `docs/WORKFLOW.md`
- `tasks/_template-task.md`

Last updated: 2026-02-03
