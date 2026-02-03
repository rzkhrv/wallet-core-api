# Coding rules (repo-aligned)

These rules align with the current wallet-core-api codebase.

**Priority note:** Agent workflow hard rules live in `AGENTS.md` and `docs/WORKFLOW.md`. Nothing in this file overrides those workflow/safety rules.

## General TypeScript

- Language:
  - Use **English** for code, identifiers, and code comments.
  - Keep documentation under `docs/` in **English**.
  - Exception: `tasks/*.md` must be written in **Russian** and must follow the `[accepted]` gate + Task Snapshot allowlist rules (see `AGENTS.md` and `docs/WORKFLOW.md`).
  - It is OK for docs to embed **Russian snippets** that are intended to be copied into task files.
- Prefer explicit types for public APIs (controller/service/adapter methods and DTOs).
- Avoid `any`; use `unknown` or concrete types.
- Use kebab-case for file and directory names.
- Use PascalCase for classes/types, camelCase for variables/functions, and UPPER_SNAKE_CASE for env vars.
- Keep functions small and single-purpose; extract helpers instead of deep nesting.
- Prefer object parameters for multi-field inputs/outputs (DTOs and adapter inputs).
- Release wallet-core objects with `.delete()` in `finally` blocks when applicable.

## NestJS + repo structure

- Controllers expose routes under `/api/v1/...` and only map request DTOs to services.
- Services orchestrate validation/transform and delegate to adapters.
- Adapters are the only layer that calls wallet-core and should wrap failures with `AdapterError`.
- DTOs live under `dto/request` and `dto/response` and use `class-validator`/`class-transformer`.
- Coin modules live under `src/coins/<coin>/` with `adapter/`, `service/`, and per-coin wallet-core config.

## Transactions

- Follow the proto-first pattern for all transaction build/sign flows (see `docs/agents/patterns/proto-first-transactions.md`).
- Do not manually encode ABI/selectors/hashes when wallet-core provides a proto.

## Testing

- Use Jest.
- Add/update `src/**/*.spec.ts` for controller/service coverage.
- Add/update `test/*.e2e-spec.ts` for endpoint coverage.

Last updated: 2026-02-03
