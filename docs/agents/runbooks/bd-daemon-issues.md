# Runbook: bd daemon issues

## Context
Beads daemon startup is slow or auto-flush fails while updating issues.

## Symptoms
- Warning: "Daemon took too long to start (>5s). Running in direct mode."
- Warning: "auto-flush failed: failed to create temp file ... operation not permitted".

## Steps
1. Check daemon health:
   ```bash
   bd doctor
   ```
2. Inspect Beads logs:
   - `.beads/daemon.log`
3. Verify repo permissions for Beads worktrees:
   - Ensure `.git/beads-worktrees/` exists and is writable by the current user.
4. If permissions are wrong, fix ownership or ask for assistance before changing permissions.
5. Retry a simple command:
   ```bash
   bd ready --json
   ```

## Verification
- `bd ready --json` runs without auto-flush warnings.
- Issue updates persist in `.beads/issues.jsonl`.

## References
- `.beads/daemon.log`
- `.beads/issues.jsonl`

Last updated: 2026-01-31
