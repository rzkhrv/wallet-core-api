# Project overview (wallet-core-api)

## Purpose
- REST API for wallet-core operations built with NestJS and `@trustwallet/wallet-core`.
- Primary capabilities: mnemonic operations, address generation/validation, and transaction building/signing for supported coins.
- Base routes are defined in controllers (for example `@Controller('api/v1/...')`), Swagger UI is served at `/api`.

## Architecture map (where things live)
- `src/main.ts` - application bootstrap, global validation pipe, global exception filter, Swagger setup.
- `src/app.module.ts` - root Nest module; wires `CoinsModule`, `CommonModule`.
- `src/common/wallet-core/` - shared wallet-core adapter:
  - `src/common/wallet-core/wallet-core.adapter.ts` - loads WASM via `initWasm()` and exposes `WalletCore` API.
  - `src/common/wallet-core/wallet-core.module.ts` - exports `WalletCoreAdapter`.
- `src/common/mnemonic/adapter/` - mnemonic adapter and adapter DTOs.
- `src/coins/` - API layer per coin:
  - `src/coins/<coin>/` - controllers, services, DTOs, module for each coin.
  - `src/coins/<coin>/adapter/` - coin-specific adapters and adapter DTOs.
  - `src/coins/<coin>/*-wallet-core.config.ts` - per-coin wallet-core type/purpose/derivation config.
  - `src/coins/coins.module.ts` - aggregates coin modules.
- `src/common/` - shared modules (mnemonic), errors, interfaces, and cross-cutting infrastructure.
- `test/` - e2e tests (`test/*.e2e-spec.ts`).
- `docs/` - agent-facing documentation (this file, COINS.md, WORKFLOW.md).

## Runtime model (request lifecycle)
1. `src/main.ts` boots Nest with `AppModule`, registers `ApiExceptionFilter`, and sets a global `ValidationPipe`.
2. `WalletCoreAdapter` initializes wallet-core WASM on module init (`initWasm()` once, cached).
3. Requests flow: Controller -> Service -> Adapter -> wallet-core.
4. Adapters translate DTOs into wallet-core calls and return DTO-shaped responses.
5. Errors are normalized by `ApiExceptionFilter` into a consistent `{ error: { code, message, details } }` shape.

## Coding conventions (repo-specific)
- Follow `docs/coding-rules.md` for naming, typing, and test conventions.
- DTOs live under `dto/request` and `dto/response` and use `class-validator`/`class-transformer` decorators.
- Coin services implement `CoinAddressService`/`CoinTransactionService` and delegate to adapters.
- Adapter errors should be wrapped in `AdapterError` and surfaced via `ApiExceptionFilter`.
- Wallet-core WASM objects are manually released via `.delete()` in `finally` blocks.

## Documentation lookup (required)
- Use the `context7` MCP server as the primary source for documentation on NestJS, TypeScript, wallet-core, and cryptocurrency topics.
- If Context7 does not cover what you need, consult other sources (prefer official docs and primary references).

## Where to look first (common tasks)
- Add a new coin: `docs/COINS.md` and existing modules in `src/coins/` + `src/coins/<coin>/adapter/`.
- Add an endpoint: start at `src/coins/<coin>/*.controller.ts` and related services/DTOs.
- Update coin derivation/SLIP44 config: `src/coins/<coin>/*-wallet-core.config.ts`.
- Error formatting: `src/common/errors/api-exception.filter.ts`.
- Swagger config: `src/main.ts` and per-controller `@Api*` decorators.
- Tests:
  - Unit/integration: `src/**/*.spec.ts`
  - E2E: `test/*.e2e-spec.ts`

## Glossary
- Adapter: Wrapper around wallet-core WASM that exposes coin operations to services.
- Coin: A supported chain represented by a module under `src/coins/<coin>/`.
- Coin config: Per-coin wallet-core mapping in `src/coins/<coin>/*-wallet-core.config.ts`.
- DTO: Request/response contract using `class-validator` and Swagger decorators.
- Derivation path: HD wallet path components (purpose, coin, account, change, index).
- Wallet-core: `@trustwallet/wallet-core` WASM library providing signing/derivation primitives.
- UTXO: Unspent transaction output (used in BTC transaction building).

## TODO (fill as repo evolves)
- Document any environment variables beyond `PORT` (if introduced).
- Document deployment/runtime infra (if this service is deployed outside standard Nest start).

See also: `docs/COINS.md` and `docs/WORKFLOW.md`.
