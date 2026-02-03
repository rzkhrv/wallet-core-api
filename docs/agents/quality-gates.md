# Quality gates

## Context
Convenience checklist for running the repo checks. The canonical DoD lives in `docs/WORKFLOW.md`.

## Goal
Provide a quick command list; if this file conflicts with `docs/WORKFLOW.md`, follow `docs/WORKFLOW.md`.

## Note for agents
If you are acting as an agent, run commands only when:
- the task plan is accepted (`[accepted]` gate), and
- the command is included in the task’s command allowlist (Task Snapshot)

## Steps
1. Format:
   ```bash
   npm run format
   ```
2. Lint (auto-fix enabled):
   ```bash
   npm run lint
   ```
3. Unit/integration tests:
   ```bash
   npm run test
   ```
4. E2E tests:
   ```bash
   npm run test:e2e
   ```
5. Build/typecheck:
   ```bash
   npm run build
   ```

## Verification
- All commands above exit successfully.
- New or changed endpoints have unit/integration specs and e2e coverage (per `docs/WORKFLOW.md`).

## References
- `docs/WORKFLOW.md`
- `package.json`
- `test/jest-e2e.json`

Last updated: 2026-02-03
