# Runbook: wallet-core WASM init errors

## Context
`@trustwallet/wallet-core` WASM fails to initialize or the adapter reports uninitialized core.

## Note for agents
Follow `AGENTS.md` and `docs/WORKFLOW.md`:
- run commands only after the task plan is accepted (`[accepted]` gate)
- run commands only if they are included in the task’s command allowlist

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
   - `src/common/wallet-core/wallet-core.adapter.ts` uses `initWasm()` in `onModuleInit()`.
4. Re-run the failing command (start server or tests) after reinstalling:
   ```bash
   npm run start
   ```
5. If the error persists, recheck for local environment constraints (e.g., file permissions, blocked WASM execution).

## Verification
- Starting the app does not throw wallet-core initialization errors.
- E2E tests run without wallet-core init failures.

## References
- `src/common/wallet-core/wallet-core.adapter.ts`
- `package.json`

Last updated: 2026-02-03
