# Quality gates

## Context
Required checks before considering work done.

## Goal
Keep formatting and tests consistent with repo rules.

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

Last updated: 2026-01-31
