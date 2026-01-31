# Decision 0001: isolate wallet-core access in adapters

## Context
This service uses `@trustwallet/wallet-core` WASM and exposes REST endpoints via NestJS.

## Goal / Problem
Prevent wallet-core usage from spreading across controllers/services and keep error handling consistent.

## Decision (steps)
1. All wallet-core access lives inside adapter classes under `src/adapter/`.
2. Services map API DTOs to adapter DTOs and call adapters only.
3. Adapters wrap errors in `AdapterError` and release WASM objects in `finally`.

## Verification
- Controllers and services do not call wallet-core APIs directly.
- Adapters use `AdapterError` and `.delete()` for WASM objects.

## References
- `docs/PROJECT.md`
- `src/adapter/`
- `src/coins/`
- `src/adapter/common/adapter-error.ts`

Last updated: 2026-01-31
