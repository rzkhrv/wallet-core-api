# Workflow: task plan gate (hard rules)

This is a **quick reference** for the task-plan acceptance gate.

Canonical sources of truth:
- `AGENTS.md` (hard rules and priority order)
- `docs/WORKFLOW.md` (full protocol + task plan template + DoD)

If anything here conflicts with those, follow `AGENTS.md` first, then `docs/WORKFLOW.md`.

---

## Hard rules (summary)

1) **Plan first**
- Before any implementation, create a task plan file in `tasks/<index>-task.md` and write a detailed plan.

2) **Acceptance gate**
- Execution is allowed only if the **first non-empty line** in the task file is exactly `[accepted]`.

3) **Agent must not accept**
- The agent must not add/edit the `[accepted]` tag in task plan files. Only the owner may do that.

4) **Scope lock (Task Snapshot)**
- Before the first change, emit a Task Snapshot with:
  - task file path + `[accepted]` confirmation
  - file/dir allowlist
  - command/action allowlist
- Touch only allowlisted files/actions.

5) **Before acceptance: read-only + planning only**
- Allowed: read/search repo, update the task file (planning).
- Forbidden: change other files, run state-changing commands (install/build/format/tests/codegen/migrations/DB queries).

6) **Stop conditions**
Stop and request re-acceptance if:
- `[accepted]` is missing (or not the first non-empty line)
- you need to touch a file or run an action outside the allowlists
- the task plan changed in a way that affects scope/criteria

Last updated: 2026-02-03
