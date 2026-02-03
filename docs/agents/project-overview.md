# Project overview

## Context
Agent-facing delta for the Wallet Core API. This file intentionally stays short to avoid duplicating `docs/PROJECT.md`.

## Canonical references (source of truth)
- Architecture/runtime: `docs/PROJECT.md`
- Workflow/DoD: `docs/WORKFLOW.md`
- Coin onboarding: `docs/COINS.md`
- Coding conventions: `docs/coding-rules.md`
- Transaction rules: `docs/agents/patterns/proto-first-transactions.md`
- Doc index: `docs/README.md`

## Agent-specific notes (delta)
- If content here conflicts with canonical docs above, prefer the canonical docs.
- Transaction work must follow the proto-first pattern; link decisions or patterns instead of re-stating rules.

## Steps
1. Start with `docs/README.md` to pick the canonical doc for your task.
2. Use `docs/PROJECT.md` to understand architecture and request flow.
3. Use the patterns/workflows docs for implementation specifics.

## Verification
- You can name which document is canonical for your task.

## References
- `docs/PROJECT.md`
- `src/main.ts`
- `src/app.module.ts`
- `src/coins/`
- `src/common/wallet-core/`

Last updated: 2026-02-02
