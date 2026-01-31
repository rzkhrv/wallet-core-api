# Runbook: wallet-core WASM init errors

## Context
`@trustwallet/wallet-core` WASM fails to initialize or the adapter reports uninitialized core.

## Symptoms
- Error: "WalletCore is not initialized".
- Exceptions during `initWasm()`.

## Steps
1. Ensure dependencies are installed:
   ```bash
   npm install
   ```
2. Confirm Node.js version is supported (18+ recommended).
3. Verify the adapter initialization path:
   - `src/adapter/common/wallet-core.adapter.ts` uses `initWasm()` in `onModuleInit()`.
4. Re-run the failing command (start server or tests) after reinstalling:
   ```bash
   npm run start
   ```
5. If the error persists, recheck for local environment constraints (e.g., file permissions, blocked WASM execution).

## Verification
- Starting the app does not throw wallet-core initialization errors.
- E2E tests run without wallet-core init failures.

## References
- `src/adapter/common/wallet-core.adapter.ts`
- `package.json`

Last updated: 2026-01-31
