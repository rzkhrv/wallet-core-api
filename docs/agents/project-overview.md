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
- TRON transactions: `build-transaction` for TRX, `build-transfer` for TRC10/TRC20.

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

Last updated: 2026-02-01
