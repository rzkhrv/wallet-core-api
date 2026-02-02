# Clean code and architecture audit

## Requirement
- When a clean-code or architecture audit is requested, use docs/coding-rules.md as the checklist.
- Record each non-compliant item as a BD task with a discovered-from link to the audit bead.
- Update this document with the findings and BD task IDs.

## Findings (2026-02-02)
- No open findings. Previous items were resolved or superseded by updated coding rules.

## Resolved (2026-02-02)
- ETH/TRON numeric parsing corrected (BD: wallet-core-api-wwk).
- Swagger POST status codes aligned to 201 (BD: wallet-core-api-idr).
- TRON address validation added to DTOs (BD: wallet-core-api-zfk).
- Removed `any` from TRON parsing logic (BD: wallet-core-api-svr).
- JSDoc requirements addressed (BD: wallet-core-api-psx, wallet-core-api-3si). Note: coding rules no longer mandate JSDoc everywhere.
- One-export-per-file rule removed from coding rules; prior refactors closed (BD: wallet-core-api-bj4, wallet-core-api-d8f).

## References
- docs/coding-rules.md
- docs/WORKFLOW.md

Last updated: 2026-02-02
