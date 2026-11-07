# Shared-file owners

One writer per shared file. Others ask the owner with `uak msg ID --kind request`. Patterns are relative, with no spaces; directories end in `/`.
An owner is not a prerequisite for everyone: consumers work on published contracts and mocks. To transfer ownership, open a PR to main.

| Pattern | Owner task |
|---|---|
| package.json | HND-001 |
| package-lock.json | HND-001 |
| next.config.ts | HND-001 |
| tsconfig.json | HND-001 |
| drizzle.config.ts | HND-001 |
| render.yaml | HND-001 |
| Dockerfile | HND-001 |
| .github/workflows/ | HND-001 |
| .env.example | HND-001 |
| src/lib/db/schema.ts | HND-002 |
| src/lib/db/migrations/ | HND-002 |
| src/lib/types/ | HND-002 |
| DESIGN.md | HND-003 |
| src/app/globals.css | HND-003 |
| src/components/ui/ | HND-003 |
| src/app/layout.tsx | HND-003 |
| .uak/PROJECT.md | HND-001 |
