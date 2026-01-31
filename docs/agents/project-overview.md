# Project overview

## Context
For agents working on the Wallet Core API (NestJS service wrapping `@trustwallet/wallet-core`).

## Goal
Understand what the service does, where the main entry points live, and how requests flow through adapters.

## Summary
- Service: REST API for mnemonic, address, and transaction operations.
- Stack: Node.js + NestJS + TypeScript + `@trustwallet/wallet-core` WASM.
- Request flow: Controller → Service → Adapter → wallet-core.
- Errors normalized by `ApiExceptionFilter` into `{ error: { code, message, details } }`.
- Swagger UI served at `/api`.

## Steps
1. Read `docs/PROJECT.md` for architecture and conventions.
2. Skim `src/main.ts` and `src/app.module.ts` to see bootstrap and module wiring.
3. Review `src/coins/` and `src/adapter/` to understand coin-specific APIs and wallet-core wrappers.

## Verification
- You can point to the main entry file (`src/main.ts`) and the module aggregator (`src/app.module.ts`).
- You can describe the request flow and error shape.

## References
- `docs/PROJECT.md`
- `src/main.ts`
- `src/app.module.ts`
- `src/coins/`
- `src/adapter/`

Last updated: 2026-01-31
