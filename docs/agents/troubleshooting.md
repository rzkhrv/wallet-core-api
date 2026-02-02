# Troubleshooting

## Context
Common issues and where to find the canonical fix steps.

## Symptom index (start here)
- `bd` commands are slow or show auto-flush permission errors → `docs/agents/runbooks/bd-daemon-issues.md`.
- Server starts on a different port than expected → `docs/agents/runbooks/port-mismatch.md`.
- wallet-core WASM fails to initialize → `docs/agents/runbooks/wallet-core-init.md`.
- E2E tests fail on first run → `docs/agents/runbooks/e2e-test-setup.md`.
- Validation errors look different than expected → `src/common/errors/api-exception.filter.ts` and `docs/PROJECT.md`.
- TRC20 build fails with `TRON address payload is invalid` → `src/coins/tron/adapter/tron-address.adapter.ts` and related DTO validation in `src/coins/tron/dto/request/`.
- Address generation returns 500/`INTERNAL_ERROR` when mnemonic is invalid → `src/common/mnemonic/` and adapter error handling.
- BTC build returns a payload but signing fails → `src/coins/btc/adapter/btc-transaction.adapter.ts` (plan errors) and `docs/agents/patterns/proto-first-transactions.md`.
- TRON broadcast fails with `TAPOS_ERROR` or `SIGERROR` → ensure request uses full `blockHeader` (number, parentHash, txTrieRoot, witnessAddress, version, timestamp) from the same network. See `src/coins/tron/adapter/tron-transaction.adapter.ts` and `docs/agents/decisions/0002-tron-proto-first-signing.md`.

## Verification
- You can find the runbook or source-of-truth link for the symptom.

## References
- `docs/agents/runbooks/bd-daemon-issues.md`
- `docs/agents/runbooks/port-mismatch.md`
- `docs/agents/runbooks/wallet-core-init.md`
- `docs/agents/runbooks/e2e-test-setup.md`
- `src/main.ts`

Last updated: 2026-02-02
