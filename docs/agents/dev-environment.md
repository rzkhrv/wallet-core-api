# Dev environment

## Context
Local setup for running and testing the Wallet Core API.

## Goal
Get a working dev server with predictable ports and configuration.

## Note for agents
If you are acting as an agent, follow `AGENTS.md` and `docs/WORKFLOW.md`:
- run commands only after the task plan is accepted (`[accepted]` gate)
- run commands only if they are included in the task’s command allowlist

## Steps
1. Install Node.js (18+ recommended).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run start:dev
   ```
4. (Optional) Override the port:
   ```bash
   PORT=3000 npm run start
   ```

## Verification
- `GET /` returns `{ status: "ok", service: "wallet-core-api", timestamp: "..." }`.
- Swagger UI loads at `http://localhost:3001/api` (unless `PORT` is set).

## References
- `README.md`
- `src/main.ts`
- `package.json`

Last updated: 2026-02-03
