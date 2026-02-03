# Clean code and architecture audit

## Requirement
- When a clean-code or architecture audit is requested, use docs/coding-rules.md as the checklist.
- Record each non-compliant item as a task plan file with a discovered-from link to the audit task plan.
- Update this document with the findings and task plan references.

## Findings (2026-02-02)
- No open findings. Previous items were resolved or superseded by updated coding rules.

## Resolved (2026-02-02)
- ETH/TRON numeric parsing corrected.
- Swagger POST status codes aligned to 201.
- TRON address validation added to DTOs.
- Removed `any` from TRON parsing logic.
- JSDoc requirements addressed. Note: coding rules no longer mandate JSDoc everywhere.
- One-export-per-file rule removed from coding rules; prior refactors closed.

## References
- docs/coding-rules.md
- docs/WORKFLOW.md

Last updated: 2026-02-02
