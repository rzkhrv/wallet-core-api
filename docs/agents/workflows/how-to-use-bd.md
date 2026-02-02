# Workflow: how to use bd (beads)

## Context
Step-by-step bd usage. The canonical rules live in `docs/WORKFLOW.md`.

## Goal
Provide concrete bd commands; if this file conflicts with `docs/WORKFLOW.md`, follow `docs/WORKFLOW.md`.

## Steps
1. Find ready work:
   ```bash
   bd ready --json
   ```
2. Inspect a task:
   ```bash
   bd show <id> --json
   ```
3. Claim it:
   ```bash
   bd update <id> --status in_progress --json
   ```
4. Do the work and update notes/description when scope changes:
   ```bash
   bd update <id> --description "Context: ... Acceptance: ... Plan: ... Dependencies: ..." --json
   ```
5. If new work is discovered, create a new bead linked to the parent:
   ```bash
   bd create "New task title" --description "Context: ... Acceptance: ... Plan: ... Dependencies: discovered-from:<parent-id>" --type task --priority 2 --deps discovered-from:<parent-id> --json
   ```
6. Close when acceptance criteria is met:
   ```bash
   bd close <id> --reason "Completed" --json
   ```
7. Sync Beads changes as part of the session closeout:
   ```bash
   bd sync
   ```

## Verification
- `bd show <id> --json` reflects the correct status and description.
- `bd ready --json` no longer lists completed tasks.

## References
- `docs/WORKFLOW.md`
- `.beads/README.md`

Last updated: 2026-01-31
