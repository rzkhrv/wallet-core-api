# Coins: adding and maintaining support

This file documents how to add a new coin safely and consistently. For overall architecture and conventions, see `docs/PROJECT.md`.

## Quick map (coin-related paths)
- `src/coins/<coin>/` - controllers, services, DTOs, module.
- `src/coins/<coin>/adapter/` - wallet-core adapters + adapter DTOs.
- `src/coins/<coin>/*-wallet-core.config.ts` - per-coin wallet-core type/purpose/derivation config.
- `src/coins/coins.module.ts` - registers coin modules.
- `src/common/wallet-core/` - shared wallet-core adapter used by coin adapters.
- Tests:
  - `src/coins/<coin>/**/*.spec.ts`
  - `test/*.e2e-spec.ts`

## Support checklist (required for a coin to be considered supported)
- Coin wallet-core config exists in `src/coins/<coin>/*-wallet-core.config.ts` with correct wallet-core keys.
- Coin module exists in `src/coins/<coin>/` and is registered in `src/coins/coins.module.ts`.
- Coin adapters exist in `src/coins/<coin>/adapter/` and are registered in `<coin>.module.ts`.
- Address controller + service implemented and wired to adapter.
- Transaction controller + service implemented and wired to adapter (or explicitly not supported with documented rationale).
- Request/response DTOs added for all endpoints.
- Transaction adapters follow the proto-first pattern (no manual encoding); see `docs/agents/patterns/proto-first-transactions.md`.
- Tests:
  - Unit/integration specs in `src/coins/<coin>/**/*.spec.ts`.
  - E2E coverage in `test/*.e2e-spec.ts`.
- Swagger decorators (`@ApiTags`, `@ApiOperation`, `@ApiBody`, `@ApiResponse`) added to controllers.

## Required folder/file structure per coin
Example structure (replace `ltc` with your coin key):

```
src/
  coins/
    ltc/
      adapter/
        dto/
          ltc-address-generate-input.dto.ts
          ltc-address-validate-input.dto.ts
          ltc-transaction-build-input.dto.ts
        ltc-address.adapter.ts
        ltc-transaction.adapter.ts
      ltc-wallet-core.config.ts
      dto/
        request/
          build-ltc-transaction.request.dto.ts
          generate-ltc-address.request.dto.ts
          validate-ltc-address.request.dto.ts
        response/
          build-ltc-transaction.response.dto.ts
          generate-ltc-address.response.dto.ts
          validate-ltc-address.response.dto.ts
      service/
        ltc-address.service.ts
        ltc-transaction.service.ts
      ltc-address.controller.ts
      ltc-transaction.controller.ts
      ltc.module.ts
  common/
    wallet-core/
      wallet-core.adapter.ts
    mnemonic/
      adapter/
        mnemonic.adapter.ts
```

## Endpoint naming conventions (transactions)
- `build-transaction` builds native coin transactions only.
- `build-transfer` builds token transfers only (ERC20/TRC20).
- `sign` signs payloads from either build endpoint.
- Keep route names consistent with existing coins and document any deviations.

## BTC build specifics
- BTC `build-transaction` uses `outputs` (array):
  - Each output has `address`, `amount` (required for recipients), and optional `isChange`.
  - Exactly one output must have `isChange: true`, and there must be at least one recipient output.
- The response `transaction.outputs` always includes the change output with the plan-derived change amount.
- UTXO `txid` values are expected in standard display order (big-endian hex); the adapter reverses bytes internally for wallet-core.
- BTC build uses a fixed SIGHASH type (`1`, SIGHASH_ALL); it is surfaced in the build `transaction` for inspection but not accepted in requests.

## Step-by-step: add a new coin
1. Create task plan files (see `docs/WORKFLOW.md`). Do not expand scope without new tasks.
2. Add wallet-core configuration:
   - Create `src/coins/<coin>/*-wallet-core.config.ts` with the correct `coinTypeKey`, `purposeKey`, and `derivationKey`.
3. Add adapters:
   - Create `src/coins/<coin>/adapter/` with address and transaction adapters.
   - Add adapter DTOs under `src/coins/<coin>/adapter/dto/` (use Input/Output naming).
   - Build/sign transactions via wallet-core proto messages and `AnySigner` (see proto-first pattern).
   - Wrap wallet-core errors with `AdapterError`.
   - Ensure all wallet-core WASM objects are `.delete()`-d in `finally`.
4. Add API layer:
   - Create `src/coins/<coin>/` with controllers, services, and DTOs.
   - Services should map API DTOs to adapter DTOs.
   - Controllers should use Swagger decorators consistent with existing coins.
5. Register modules/adapters:
   - Update `src/coins/coins.module.ts` to import/export the new coin module.
   - Register the coin adapters in `<coin>.module.ts`.
6. Add tests:
   - Controller/service specs in `src/coins/<coin>/**/*.spec.ts`.
   - Extend `test/*.e2e-spec.ts` to cover the new endpoints.
7. Run quality gates per `docs/WORKFLOW.md` (format + full test suite).
8. Update docs if behavior or requirements changed.

## Concrete example (skeleton + required steps)
The following is a minimal skeleton for adding `ltc` support. Replace TODOs with real wallet-core values after verification.

1) Wallet-core config (with TODO placeholders):

```
// src/coins/ltc/ltc-wallet-core.config.ts
import type { WalletCore } from '@trustwallet/wallet-core';
import type { WalletCoreCoinConfig } from '../../common/interfaces/wallet-core-coin-config.interface';
import type { WalletCoreResolvedCoinConfig } from '../../common/interfaces/wallet-core-resolved-coin-config.interface';

const LTC_WALLET_CORE_CONFIG: WalletCoreCoinConfig = {
  coinTypeKey: 'TODO_wallet_core_coinType',
  purposeKey: 'TODO_wallet_core_purpose',
  derivationKey: 'TODO_wallet_core_derivation',
};

export const resolveLtcWalletCoreConfig = (
  core: WalletCore,
): WalletCoreResolvedCoinConfig => ({
  coinType: core.CoinType[LTC_WALLET_CORE_CONFIG.coinTypeKey],
  purpose: core.Purpose[LTC_WALLET_CORE_CONFIG.purposeKey],
  derivation: core.Derivation[LTC_WALLET_CORE_CONFIG.derivationKey],
});
```

2) Register module/adapters:

```
// src/coins/coins.module.ts
imports: [BtcModule, EthModule, TronModule, LtcModule],
exports: [BtcModule, EthModule, TronModule, LtcModule],

// src/coins/ltc/ltc.module.ts
providers: [
  LtcAddressAdapter,
  LtcTransactionAdapter,
  LtcAddressService,
  LtcTransactionService,
],
```

3) Minimal folder skeleton (see full structure above):

```
src/coins/ltc/adapter/ltc-address.adapter.ts
src/coins/ltc/adapter/ltc-transaction.adapter.ts
src/coins/ltc/adapter/dto/*
src/coins/ltc/ltc-wallet-core.config.ts
src/coins/ltc/ltc-address.controller.ts
src/coins/ltc/ltc-transaction.controller.ts
src/coins/ltc/ltc.module.ts
src/coins/ltc/dto/request/*
src/coins/ltc/dto/response/*
src/coins/ltc/service/*
```

## Common pitfalls & security considerations
- Wrong wallet-core config keys (coin type, purpose, derivation) lead to invalid addresses or signatures.
- Forgetting to register the coin in `CoinsModule` or adapters in `<coin>.module.ts` will cause DI failures.
- Not deleting wallet-core WASM objects can leak memory over time.
- Logging secrets (mnemonic, private keys) is prohibited; keep logs to non-sensitive fields.
- Amounts and chain params are strings in DTOs; avoid numeric truncation.
- Missing DTO validation decorators means extra fields may slip through (global pipe is strict).
- Every new endpoint must be covered by unit/integration specs and e2e tests.

## When you learn something new (safe doc updates)
- Add new rules as short bullets with file paths and a brief rationale.
- Prefer incremental updates over rewriting large sections.
- If a rule is coin-specific, say so explicitly.
- Keep examples minimal and grounded in existing code.
- Cross-link to `docs/PROJECT.md` or `docs/WORKFLOW.md` when relevant.
