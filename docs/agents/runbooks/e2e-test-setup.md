# Runbook: e2e test setup failures

## Context
End-to-end tests fail to start or fail unexpectedly.

## Symptoms
- `npm run test:e2e` exits with setup errors.
- Tests hang or crash during wallet-core calls.

## Steps
1. Ensure dependencies are installed:
   ```bash
   npm install
   ```
2. Run e2e tests directly:
   ```bash
   npm run test:e2e
   ```
3. If failures mention wallet-core init, follow `wallet-core-init.md`.
4. If tests time out, re-run in band for clearer logs:
   ```bash
   node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --config ./test/jest-e2e.json --runInBand
   ```

## Verification
- `npm run test:e2e` completes successfully.

## References
- `test/jest-e2e.json`
- `test/app.e2e-spec.ts`
- `docs/agents/runbooks/wallet-core-init.md`

Last updated: 2026-01-31
