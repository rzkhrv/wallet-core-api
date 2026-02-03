# AGENTS (operating rules)

This file is the entrypoint for AI agents working in this repository.

## Priority and conflict resolution

When instructions conflict, follow this order:

1) **Security / privacy hard rules** in this file (non-negotiable).
2) **The active task plan file** in `tasks/<id>-task.md` (scope + acceptance criteria). Task plans may not override hard rules.
3) **Workflow + DoD**: `docs/WORKFLOW.md`.
4) **Coding conventions**: `docs/coding-rules.md`.
5) **Architecture + feature docs**: `docs/PROJECT.md`, `docs/COINS.md`, and the docs under `docs/agents/`.

If still ambiguous: **stop**, document the ambiguity in the task plan (“Open questions”), and ask the owner. Prefer the most restrictive interpretation.

---

## HARD RULES (non-negotiable)

### HR1 — Task plan gate: no implementation without acceptance
- Any action that can change the repo, generated artifacts, runtime state, or data is **implementation**.
- Before any implementation, there must be a task plan file in `tasks/` describing *exactly* what will be done.
- Execution is allowed **only if** the **first non-empty line** of the task plan file is exactly:
  - `[accepted]`
- **The agent MUST NOT add or edit the `[accepted]` line in task plan files.** Only the human owner adds it.

### HR2 — Scope lock via allowlists (Task Snapshot)
Before the first change, the agent must emit a **Task Snapshot** (in chat and/or inside the task file) that includes:
- Task file path + confirmation that the first non-empty line is `[accepted]`.
- **Allowlist of files/directories** the agent is allowed to modify.
- **Allowlist of commands/actions** the agent is allowed to run.

Rules:
- Touch **only** files and actions on the allowlists.
- If a new file/command is needed: **stop**, update the task plan + allowlists, and wait for **re-acceptance**.

### HR3 — Allowed actions before acceptance
If `[accepted]` is missing, the agent may:
- Read/navigate the repository (open files, search/grep, inspect configs/docs).
- Create or edit the task plan file itself (planning only).

If `[accepted]` is missing, the agent must **not**:
- Modify any repo files other than the task plan file.
- Run commands that may change the workspace or state (install, build, format, tests, codegen, migrations, DB queries, etc.).

If a command is needed to improve planning, add it to the plan + allowlist and wait for acceptance.

### HR4 — Secrets and sensitive wallet material
Never log, persist, or echo:
- mnemonics / seed phrases
- private keys
- raw signatures
- any secret request payloads

Use redaction in logs/tests and keep error handling consistent.

### HR5 — Generated and vendor files
Never edit generated or vendor output:
- `dist/`
- `node_modules/`
- any other generated artifacts

### HR6 — Knowledge capture is mandatory
Any new non-obvious repo knowledge, failure mode, or workflow improvement discovered during work **must** be captured under `docs/agents/` in the same change set (pattern/runbook/decision as appropriate).

---

## Standard execution loop (must follow)

1) **Create or locate** a task plan file in `tasks/` (draft state).
2) **Fill the plan** (task files are written in **Russian**) including:
   - acceptance criteria, non-goals, risks, rollback
   - file + command allowlists (scope lock)
3) **Wait** until the owner adds `[accepted]` as the first non-empty line.
4) **Re-open and re-read** the task plan; then emit a **Task Snapshot**.
5) **Execute strictly** within scope; keep an execution log; run required quality gates.
6) **Capture knowledge** in `docs/agents/` if anything non-obvious was discovered.
7) Mark the task **done** and record any deviations/blockers in the task plan.

---

## Where to look (docs map)

Start here:
- `docs/README.md`

Canonical docs:
- Architecture/runtime: `docs/PROJECT.md`
- Workflow + DoD: `docs/WORKFLOW.md`
- Coin onboarding: `docs/COINS.md`
- Coding conventions: `docs/coding-rules.md`

Agent-focused guides:
- Repo map: `docs/agents/repo-map.md`
- Dev environment: `docs/agents/dev-environment.md`
- Quality gates: `docs/agents/quality-gates.md`
- Security: `docs/agents/security.md`
- Troubleshooting: `docs/agents/troubleshooting.md`
- Patterns: `docs/agents/patterns/`
- Runbooks: `docs/agents/runbooks/`
- Decisions: `docs/agents/decisions/`

Last updated: 2026-02-03
