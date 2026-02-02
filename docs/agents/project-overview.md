# Project overview

## Context
For agents working on the Wallet Core API (NestJS service wrapping `@trustwallet/wallet-core`).

## Goal
Understand what the service does, where the main entry points live, and how requests flow through adapters.

## Summary
- Service: REST API for mnemonic, address, and transaction operations.
- Stack: Node.js + NestJS + TypeScript + `@trustwallet/wallet-core` WASM.
- Request flow: Controller → Service → Adapter → wallet-core (coin adapters live under `src/coins/<coin>/adapter/`).
- Errors normalized by `ApiExceptionFilter` into `{ error: { code, message, details } }`.
- Swagger UI served at `/api`.
- POST endpoints return HTTP 201; Swagger responses use 201 to match runtime defaults.
- TRON transactions: `build-transaction` for TRX, `build-transfer` for TRC20.
- TRON build inputs accept optional `timestamp`/`expiration` (service defaults to now/now+60s) and accept decimal-only numerics; `blockId` is 32-byte hex.
- Build transaction endpoints return `{ payload, transaction }` where `transaction` is derived from built artifacts (ETH/BTC decode signing input, TRON TRC20 decodes `triggerSmartContract.data`).
- TRON payloads are hex-encoded UTF-8 raw JSON; TRON sign expects the hex payload and decodes to rawJson before wallet-core signing.
- Wallet-core TRON signing with `SigningInput.rawJson` returns an empty `SigningOutput.json`, so the adapter builds signed JSON + `raw_data_hex` manually and may re-sign to inject `ref_block_bytes`/`ref_block_hash`.
- BTC build supports multiple outputs via `extraOutputs`; request supplies outputs list with exactly one change output, which is returned in transaction outputs with plan-derived change amount.
- BTC build expects UTXO txids in standard display order (big-endian hex), reverses bytes for wallet-core, and uses fixed hashType `1` (SIGHASH_ALL) surfaced only in build responses.
- Documentation lookup: always check MCP Context7 first for NestJS, TypeScript, wallet-core, and crypto references.

## Steps
1. Read `docs/PROJECT.md` for architecture and conventions.
2. Skim `src/main.ts` and `src/app.module.ts` to see bootstrap and module wiring.
3. Review `src/coins/` and `src/common/wallet-core/` to understand coin-specific APIs and shared wallet-core wrappers.

## Verification
- You can point to the main entry file (`src/main.ts`) and the module aggregator (`src/app.module.ts`).
- You can describe the request flow and error shape.

## References
- `docs/PROJECT.md`
- `src/main.ts`
- `src/app.module.ts`
- `src/coins/`
- `src/common/wallet-core/`

Last updated: 2026-02-02
