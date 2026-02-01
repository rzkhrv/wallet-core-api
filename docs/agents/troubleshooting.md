# Troubleshooting

## Context
Common issues and where to find the fix steps.

## Symptoms
- `bd` commands are slow or show auto-flush permission errors.
- Server starts on a different port than expected.
- wallet-core WASM fails to initialize.
- E2E tests fail on first run.
- Validation errors look different than expected.
- TRC20 build fails with `TRON address payload is invalid` (TRON `AnyAddress.data()` can be empty).

## Steps
1. For bd daemon startup or auto-flush errors, use the bd runbook.
2. For port mismatches, verify `src/main.ts` and `PORT` env.
3. For wallet-core init errors, check the wallet-core runbook.
4. For e2e test failures, follow the e2e setup runbook.
5. For TRC20 build failures, handle `AnyAddress.data()` length 0 by decoding base58 and accept 20/21 bytes.

## Verification
- You can start the service and hit `GET /`.
- `npm run test:e2e` passes (or failures are explained and tracked in bd).

## References
- `docs/agents/runbooks/bd-daemon-issues.md`
- `docs/agents/runbooks/port-mismatch.md`
- `docs/agents/runbooks/wallet-core-init.md`
- `docs/agents/runbooks/e2e-test-setup.md`
- `src/main.ts`

Last updated: 2026-01-31
