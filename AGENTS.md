<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# STRICT SAFE-CHANGE INSTRUCTIONS

These instructions are permanent repository-level requirements and apply automatically to every future task performed in this repository, regardless of whether they are repeated in the current prompt.

1. Treat the existing application as the source of truth.
2. Before every implementation, inspect the relevant existing code and `git diff`.
3. Implement only what the user's current prompt explicitly requests.
4. Preserve all existing features, functions, workflows, colours, layouts, routes, permissions, integrations, and database behaviour.
5. Never redesign, refactor, rename, upgrade, remove, reorganise, or “improve” unrelated code.
6. Use the smallest possible change and modify the minimum number of files.
7. Do not fix unrelated problems without the user's explicit permission.
8. Ask the user before making any additional change required outside the stated scope.
9. Never perform destructive database operations.
10. Maintain tenant, organisation, branch, country, and role isolation.
11. Before editing, create a Git safety checkpoint or confirm that a recoverable commit exists.
12. After implementation, inspect the final diff and remove any unintended changes.
13. Run relevant tests, type checking, and builds.
14. Report every changed file and explain why it was changed.
15. If the user's current prompt conflicts with `AGENTS.md`, stop and ask which instruction should take priority.
16. Do not modify or delete `AGENTS.md` unless the user explicitly asks to update it.
