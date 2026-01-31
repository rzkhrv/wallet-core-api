# Security

## Context
Handling sensitive wallet data (mnemonics, private keys, raw signatures) and error reporting.

## Goal
Prevent secrets from leaking and keep error responses consistent.

## Steps
1. Never log or persist mnemonics, private keys, or raw signatures.
2. Keep adapter errors wrapped in `AdapterError` and let `ApiExceptionFilter` format responses.
3. Preserve strict validation: `ValidationPipe` uses `whitelist`, `forbidNonWhitelisted`, and `transform`.
4. Delete wallet-core WASM objects in adapters (`.delete()` in `finally`).

## Verification
- No logs include secret fields from request DTOs.
- Errors return `{ error: { code, message, details } }`.
- Adapter code releases wallet-core objects in `finally` blocks.

## References
- `src/common/errors/api-exception.filter.ts`
- `src/adapter/common/adapter-error.ts`
- `src/adapter/coins/`
- `src/main.ts`

Last updated: 2026-01-31
