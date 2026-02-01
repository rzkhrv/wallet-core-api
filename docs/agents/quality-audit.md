# Clean code and architecture audit

## Requirement
- When a clean-code or architecture audit is requested, use docs/coding-rules.md as the checklist.
- Record each non-compliant item as a BD task with a discovered-from link to the audit bead.
- Update this document with the findings and BD task IDs.

## Findings (2026-01-31)
- Decimal or hex parsing in ETH/TRON adapters treats digit-only values as hex (BD: wallet-core-api-wwk).
- Swagger @ApiResponse status codes for POST routes show 200 while runtime defaults to 201 (BD: wallet-core-api-idr).
- TRON transaction DTOs do not validate owner/to/contract addresses (BD: wallet-core-api-zfk).
- any is used in TRON rawJson parsing logic (BD: wallet-core-api-svr).
- Public API layer classes and methods lack JSDoc (BD: wallet-core-api-psx).
- Adapter layer classes and DTOs lack JSDoc (BD: wallet-core-api-3si).
- Multi-export files violate the one-export-per-file rule (core and adapter DTOs) (BD: wallet-core-api-bj4, wallet-core-api-d8f).

## References
- docs/coding-rules.md
- docs/WORKFLOW.md

Last updated: 2026-02-01
