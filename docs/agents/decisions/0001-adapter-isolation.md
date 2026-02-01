# Decision 0001: isolate wallet-core access in adapters

## Context
This service uses `@trustwallet/wallet-core` WASM and exposes REST endpoints via NestJS.

## Goal / Problem
Prevent wallet-core usage from spreading across controllers/services and keep error handling consistent.

## Decision (steps)
1. All wallet-core access lives inside adapter classes under `src/coins/<coin>/adapter/` and shared wrappers under `src/common/wallet-core/`.
2. Services map API DTOs to adapter DTOs and call adapters only.
3. Adapters wrap errors in `AdapterError` and release WASM objects in `finally`.

## Verification
- Controllers and services do not call wallet-core APIs directly.
- Adapters use `AdapterError` and `.delete()` for WASM objects.

## References
- `docs/PROJECT.md`
- `src/coins/`
- `src/common/wallet-core/`
- `src/common/errors/adapter-error.ts`

Last updated: 2026-02-01
