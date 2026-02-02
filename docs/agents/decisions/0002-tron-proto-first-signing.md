# Decision 0002: TRON proto-first signing (no rawJson/manual encoding)

## Context
TRON transactions previously relied on manual ABI encoding and raw JSON shaping (including custom raw_data protobuf encoding and txID hashing) to satisfy wallet-core signing requirements.

## Goal / Problem
Align TRON build/sign flows with the proto-first policy and ensure Wallet-Core is the single source of truth for serialization, hashing, and txID derivation.

## Decision (steps)
1. Build TRON transactions using `TW.Tron.Proto.Transaction` + `SigningInput.transaction` (TRX uses `TransferContract`, TRC20 uses `TransferTRC20Contract`).
2. Stop raw JSON signing flows because wallet-core requires `txID` inside raw JSON (which otherwise forces manual raw_data encoding + hashing).
3. Require full `blockHeader` input (`number`, `parentHash`, `txTrieRoot`, `witnessAddress`, `version`, `timestamp`) so wallet-core derives `ref_block_bytes/hash` from the proto.
4. Enforce `callValue` to be `0` for TRC20 transfers (TransferTRC20Contract does not include callValue).

## Consequences / Notes
- `ref_block_hash` is derived by wallet-core from `BlockHeader`; a full block header is required for valid broadcast.
- TRC20 transfers with non-zero `callValue` are rejected.
- Build payloads are hex-encoded `SigningInput` bytes (not raw JSON).

## Verification
- Build responses return `{ payload, transaction }` with `transaction` derived from proto fields.
- Signing uses `AnySigner` outputs directly (txId, raw JSON, raw_data_hex, signature).

## References
- `src/coins/tron/adapter/tron-transaction.adapter.ts`
- `src/coins/tron/service/tron-transaction.service.ts`
- `node_modules/@trustwallet/wallet-core/dist/generated/core_proto.d.ts`

Last updated: 2026-02-02
