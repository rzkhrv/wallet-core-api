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
3. If `bd ready --json` times out or you see `operation not permitted` for `~/.beads/registry.lock`, run in direct mode to unblock:
   ```bash
   bd ready --json --no-daemon
   ```
4. If write commands warn about auto-flush failures in `.git/beads-worktrees/`, retry with `--no-auto-flush` and fix permissions before syncing:
   ```bash
   bd update <id> --status in_progress --json --no-daemon --no-auto-flush
   ```
5. Verify repo permissions for Beads worktrees:
   - Ensure `.git/beads-worktrees/` exists and is writable by the current user.
6. If permissions are wrong, fix ownership or ask for assistance before changing permissions.
7. Retry a simple command:
   ```bash
   bd ready --json
   ```

## Verification
- `bd ready --json` runs without auto-flush warnings.
- Issue updates persist in `.beads/issues.jsonl`.

## References
- `.beads/daemon.log`
- `.beads/issues.jsonl`

Last updated: 2026-02-01
