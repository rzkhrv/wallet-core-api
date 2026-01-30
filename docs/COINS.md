# Coins: adding and maintaining support

This file documents how to add a new coin safely and consistently. For overall architecture and conventions, see `docs/PROJECT.md`.

## Quick map (coin-related paths)
- `src/coins/enum/coin.enum.ts` - supported coin identifiers.
- `src/coins/coin.config.ts` - wallet-core coin type + derivation mapping.
- `src/coins/<coin>/` - controllers, services, DTOs, module.
- `src/adapter/coins/<coin>/` - wallet-core adapters + adapter DTOs.
- `src/coins/coins.module.ts` - registers coin modules.
- `src/adapter/adapter.module.ts` - registers coin adapters.
- Tests:
  - `src/coins/<coin>/**/*.spec.ts`
  - `test/*.e2e-spec.ts`

## Support checklist (required for a coin to be considered supported)
- Coin enum entry exists in `src/coins/enum/coin.enum.ts`.
- Coin config entry exists in `src/coins/coin.config.ts` with correct wallet-core keys.
- Coin module exists in `src/coins/<coin>/` and is registered in `src/coins/coins.module.ts`.
- Coin adapters exist in `src/adapter/coins/<coin>/` and are registered in `src/adapter/adapter.module.ts`.
- Address controller + service implemented and wired to adapter.
- Transaction controller + service implemented and wired to adapter (or explicitly not supported with documented rationale).
- Request/response DTOs added for all endpoints.
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
  adapter/
    coins/
      ltc/
        dto/
          ltc-address-generate.dto.ts
          ltc-address-validate.dto.ts
          ltc-transaction-build.dto.ts
        ltc-address.adapter.ts
        ltc-transaction.adapter.ts
```

## Endpoint naming conventions (transactions)
- Signing endpoints must follow this format:
  - `/api/v1/transaction/<coin>/sign-transfer` (only if the coin supports contract/token transfers).
  - `/api/v1/transaction/<coin>/sign-transaction` (for raw transaction signing).
- Keep route names consistent with existing coins and document any deviations.

## Step-by-step: add a new coin
1. Create BD tasks (see `docs/WORKFLOW.md`). Do not expand scope without new tasks.
2. Add the coin identifier:
   - Update `src/coins/enum/coin.enum.ts` with `COIN = 'coin'`.
3. Add wallet-core configuration:
   - Update `src/coins/coin.config.ts` with the correct `coinTypeKey`, `purposeKey`, and `derivationKey`.
4. Add adapters:
   - Create `src/adapter/coins/<coin>/` with address and transaction adapters.
   - Add adapter DTOs under `src/adapter/coins/<coin>/dto/`.
   - Wrap wallet-core errors with `AdapterError`.
   - Ensure all wallet-core WASM objects are `.delete()`-d in `finally`.
5. Add API layer:
   - Create `src/coins/<coin>/` with controllers, services, and DTOs.
   - Services should map API DTOs to adapter DTOs.
   - Controllers should use Swagger decorators consistent with existing coins.
6. Register modules/adapters:
   - Update `src/coins/coins.module.ts` to import/export the new coin module.
   - Update `src/adapter/adapter.module.ts` to provide/export new adapters.
7. Add tests:
   - Controller/service specs in `src/coins/<coin>/**/*.spec.ts`.
   - Extend `test/*.e2e-spec.ts` to cover the new endpoints.
8. Run quality gates per `docs/WORKFLOW.md` (format + full test suite).
9. Update docs if behavior or requirements changed.

## Concrete example (skeleton + required steps)
The following is a minimal skeleton for adding `ltc` support. Replace TODOs with real wallet-core values after verification.

1) Enum + config (with TODO placeholders):

```
// src/coins/enum/coin.enum.ts
export enum Coin {
  BTC = 'btc',
  ETH = 'eth',
  TRON = 'tron',
  LTC = 'ltc',
}

// src/coins/coin.config.ts
export const COIN_CONFIG: Record<Coin, CoinConfig> = {
  // existing coins...
  [Coin.LTC]: {
    coinTypeKey: 'TODO_wallet_core_coinType',
    purposeKey: 'TODO_wallet_core_purpose',
    derivationKey: 'TODO_wallet_core_derivation',
  },
};
```

2) Register module/adapters:

```
// src/coins/coins.module.ts
imports: [BtcModule, EthModule, TronModule, LtcModule],
exports: [BtcModule, EthModule, TronModule, LtcModule],

// src/adapter/adapter.module.ts
providers: [/* ... */, LtcAddressAdapter, LtcTransactionAdapter],
exports: [/* ... */, LtcAddressAdapter, LtcTransactionAdapter],
```

3) Minimal folder skeleton (see full structure above):

```
src/coins/ltc/ltc-address.controller.ts
src/coins/ltc/ltc-transaction.controller.ts
src/coins/ltc/ltc.module.ts
src/coins/ltc/dto/request/*
src/coins/ltc/dto/response/*
src/coins/ltc/service/*

src/adapter/coins/ltc/ltc-address.adapter.ts
src/adapter/coins/ltc/ltc-transaction.adapter.ts
src/adapter/coins/ltc/dto/*
```

## Common pitfalls & security considerations
- Wrong wallet-core config keys (coin type, purpose, derivation) lead to invalid addresses or signatures.
- Forgetting to register the coin in `CoinsModule` or adapters in `AdapterModule` will cause DI failures.
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
