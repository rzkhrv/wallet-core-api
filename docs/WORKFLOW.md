# Agent workflow (mandatory)

This document defines the mandatory task-plan protocol and Definition of Done (DoD) for any agent working in this repo.

**Priority:** If anything here conflicts with `AGENTS.md`, follow `AGENTS.md` first.

---

## Terms (what words mean here)

- **Task plan file**: a Markdown file under `tasks/` named `<index>-task.md` (example: `tasks/00042-task.md`). It is the single source of truth for the task scope.
- **Task plan template**: `tasks/_template-task.md` (copy it to `tasks/<index>-task.md`).
- **Owner**: the human who reviews/edits the task plan and approves execution.
- **Agent**: the executor who proposes a plan and performs implementation after approval.
- **Implementation**: any action that can change the repo, generated artifacts, runtime state, or data (editing files, running build/format/tests that can create artifacts, migrations, DB queries, etc.).
- **Task Snapshot**: an explicit scope lock (allowlists) emitted right before implementation begins.

---

## Mandatory process rules (non-negotiable)

### R1. Plan first (no implementation without a task plan)
Before any implementation, create (or identify) a task plan file in `tasks/` and write a detailed plan.

### R2. Acceptance gate: `[accepted]` in the first non-empty line
A task plan is executable **only if** the **first non-empty line** of the task plan file is exactly:

- `[accepted]`

If the tag is missing, **implementation is forbidden**.

Important details:
- The check is for the **first non-empty line** (not “somewhere in the file”).
- The tag is case/whitespace sensitive.

### R3. The agent must not add `[accepted]` to task plan files
Only the human owner may add or edit the acceptance tag in task plan files.

> Note: the string `[accepted]` may appear in documentation/examples; the prohibition applies to editing task files.

### R4. Scope lock: Task Snapshot allowlists are required
Before the first implementation change, emit a **Task Snapshot** that includes:
- task file path + confirmation that the first non-empty line is `[accepted]`
- **allowlist of files/directories** that may be modified
- **allowlist of commands/actions** that may be executed

Without a Task Snapshot, any changes are forbidden.

### R5. No silent scope expansion
- Do not touch files or run actions not listed in the task plan / allowlists.
- If new work is discovered:
  - stop,
  - update the task plan (or create a new task file and link it in `Dependencies`),
  - wait for re-acceptance.

### R6. Re-read the task plan before executing and before critical steps
The task plan can change at any time. The agent must:
- re-open and re-read the task plan immediately before starting implementation
- re-read it before critical steps (migrations, large refactors, potentially destructive operations)

If the plan changed in a way that affects scope/criteria: stop and request re-acceptance.

---

## Allowed actions before acceptance (when `[accepted]` is missing)

Allowed:
- Read/navigate repo files and docs.
- Search/grep, inspect configs, reason about approaches.
- Create/edit the task plan file itself (planning only).

Forbidden:
- Modify any repo files other than the task plan file.
- Run commands that can change the workspace/state (install, build, format, tests, codegen, migrations, DB queries, etc.).

If you need to run something to plan correctly, add it to the plan + command allowlist and wait for acceptance.

---

## Task Snapshot format (required)

Use this format (copy/paste):

```md
## Task Snapshot
- Task file: tasks/00000-task.md
- Acceptance: first non-empty line is `[accepted]` ✅
- Scope allowlist (files/dirs I may change):
  - <path or glob 1>
  - <path or glob 2>
- Action allowlist (commands/operations I may run):
  - <command 1>
  - <command 2>
- Out of scope (explicitly not doing):
  - <non-goal 1>
  - <non-goal 2>
```

---

## Task plan template (tasks are written in Russian)

Task plan files must be written in **Russian**.

Canonical copy/paste template:
- `tasks/_template-task.md` (copy it to `tasks/NNNNN-task.md`)

Rendered template:

[draft]
<!-- TEMPLATE: copy this file to tasks/NNNNN-task.md, then fill it in.
Owner only: change [draft] to [accepted] as the first non-empty line. -->

# {{Название задачи}}

- **Priority:** 0–4
- **Status:** planned | in_progress | blocked | done

## Описание

### Контекст
- {{почему эта задача существует}}
- {{ссылки на код/доки, если есть}}
- {{ограничения/допущения, если есть}}

### Критерии приемки
- [ ] {{что должно быть истинно после выполнения}}
- [ ] {{критерии, связанные с форматами/ошибками/контрактами API, если нужно}}
- [ ] {{не забыть о негативных кейсах, если релевантно}}

## Не делаем
- {{что сознательно не входит в задачу}}
- {{что откладываем на отдельную задачу}}

## План
1. {{шаг}} — {{ожидаемый результат}}
2. {{шаг}} — {{ожидаемый результат}}
3. {{шаг}} — {{ожидаемый результат}}

## Скоуп

### Allowlist: файлы/директории, которые можно менять
- {{путь/директория}}
- {{путь/директория}}

### Allowlist: команды/операции, которые можно запускать
- {{команда}}
- {{команда}}

## Тестирование
- {{какие тесты запускаем и что должно пройти}}
- {{ручные проверки, если релевантно}}

## Риски
- {{что может пойти не так}}

## Откат
- {{как вернуть изменения / что делать при ошибке}}

## Открытые вопросы
- {{вопрос 1}}
- {{вопрос 2}}

## Лог выполнения
- {{YYYY-MM-DD HH:MM}} — {{что сделано}} — {{результат}}

## Dependencies
- none
<!-- или:
- discovered-from: tasks/00000-task.md
- tasks/00001-task.md
-->


---

## Definition of Done (DoD) per task

Unless the task plan explicitly says otherwise, DoD includes:

- Format: `npm run format`
- Lint: `npm run lint`
- Unit/integration tests: `npm run test`
- E2E tests: `npm run test:e2e`
- Build/typecheck: `npm run build`
- All new/changed endpoints have automated tests (see below)

If a check cannot run due to missing environment/data, record it in the task plan and create a follow-up task plan file describing the blocker.

---

## Endpoint test requirement (what it means here)

For this repo, an “endpoint test” means both:

- Unit/integration coverage: controller/service specs under `src/**/*.spec.ts` exercising happy path + validation/error paths.
- E2E coverage: `test/*.e2e-spec.ts` using `supertest` against the Nest app.

When you add a new endpoint, you must:
- add/extend `src/**/*.spec.ts`
- add/extend an e2e spec that calls the route and asserts status + response shape

---

## Knowledge capture rule (mandatory)

Any newly discovered non-obvious repo knowledge (failure modes, gotchas, patterns, decisions) must be written under `docs/agents/` in the same change set.

Last updated: 2026-02-03
