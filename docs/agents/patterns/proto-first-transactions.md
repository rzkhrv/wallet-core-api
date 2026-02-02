# Pattern: proto-first transaction building

## Context
Wallet-Core provides coin-specific protobuf messages and AnySigner flows for building and signing transactions. Manual encoding (ABI selectors, padding, custom serialization, raw JSON shaping) causes drift and should be avoided.

## Rules (non-negotiable)
1. If a Wallet-Core proto message exists for the operation, use it.
2. Manual encoding is forbidden unless no proto alternative exists.
3. If manual encoding is unavoidable, add a short justification comment and reference the Wallet-Core source proving no proto alternative exists.
4. Build responses must be `{ payload, transaction }`, where `transaction` is derived from the assembled proto or AnySigner output.
5. Signing outputs must use AnySigner results directly (tx id, signature, raw JSON / encoded payload). No post-sign mutation.

## Adapter checklist
- Assemble `TW.<Coin>.Proto.*` messages directly from DTOs.
- Encode `SigningInput` bytes as the payload.
- Derive the `transaction` response from proto fields (not DTO echoing).
- Keep coin-specific logic inside the adapter.

## Tests
- Unit/integration: ensure proto assembly + response shape.
- E2E: build -> sign flow per coin.

## References
- `docs/agents/patterns/coin-controller-service-adapter.md`
- `docs/agents/decisions/0002-tron-proto-first-signing.md`

Last updated: 2026-02-02
