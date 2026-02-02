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
- Address generation returns 500/`INTERNAL_ERROR` when mnemonic is invalid.
- BTC build returns a payload but signing fails due to an unhandled plan error.
- TRON broadcast fails with `TAPOS_ERROR`.
- TRON broadcast fails with `SIGERROR` after signing.

## Steps
1. For bd daemon startup or auto-flush errors, use the bd runbook.
2. For port mismatches, verify `src/main.ts` and `PORT` env.
3. For wallet-core init errors, check the wallet-core runbook.
4. For e2e test failures, follow the e2e setup runbook.
5. For TRC20 build failures, handle `AnyAddress.data()` length 0 by decoding base58 and accept 20/21 bytes.
6. For mnemonic-related 500s, validate mnemonics before wallet creation and wrap wallet creation in adapter try/catch.
7. For BTC build/sign mismatches, check `TransactionPlan.error` from `AnySigner.plan` and fail fast when non-OK.
8. For TRON `TAPOS_ERROR`, require `blockId` (32-byte hex) and `blockNumber` (decimal/hex), then derive `ref_block_bytes`/`ref_block_hash` into the payload.
9. For TRON `SIGERROR`, ensure the signed response includes `raw_data_hex` and broadcast with `visible: false` (hex addresses). Compute `txID` from `raw_data_hex` (SHA-256) before signing; wallet-core uses provided `txID` as-is.

## Verification
- You can start the service and hit `GET /`.
- `npm run test:e2e` passes (or failures are explained and tracked in bd).

## References
- `docs/agents/runbooks/bd-daemon-issues.md`
- `docs/agents/runbooks/port-mismatch.md`
- `docs/agents/runbooks/wallet-core-init.md`
- `docs/agents/runbooks/e2e-test-setup.md`
- `src/main.ts`

Last updated: 2026-02-02
