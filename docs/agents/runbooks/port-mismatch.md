# Runbook: port mismatch (README vs runtime)

## Context
README mentions port 3000 but the app listens on a different default.

## Note for agents
Follow `AGENTS.md` and `docs/WORKFLOW.md`:
- run commands only after the task plan is accepted (`[accepted]` gate)
- run commands only if they are included in the task’s command allowlist

## Symptoms
- Server starts on `http://localhost:3001` while expecting `3000`.

## Steps
1. Check the default port in `src/main.ts`:
   - `app.listen(process.env.PORT ?? 3001)`
2. Decide which port to use:
   - Set `PORT` explicitly when starting the app.
   ```bash
   PORT=3000 npm run start
   ```
3. Update agent docs if you discover a new default.

## Verification
- Health endpoint responds on the expected port.

## References
- `src/main.ts`
- `README.md`

Last updated: 2026-02-03
