# AGENTS.md

## Purpose
- This file is the operating guide for coding agents working in this repository.
- Follow existing project conventions first; do not introduce new frameworks or architecture unless requested.
- Keep changes scoped, reversible, and consistent with the current Spanish-domain naming style.

## Repository Map
- Root contains Docker orchestration (`docker-compose.yml`) and separate backend/frontend apps.
- Backend: `Backend/sistema-de-apuestas` (ASP.NET Core, .NET 10, layered architecture).
- Frontend: `Frontend/front-sistema-apuestas` (React 19 + TypeScript + Vite).
- There is also `Frontend/package.json` with a single dependency; primary frontend app is `Frontend/front-sistema-apuestas`.

## Rule Files (Cursor / Copilot)
- `.cursorrules`: not found.
- `.cursor/rules/`: not found.
- `.github/copilot-instructions.md`: not found.
- `.github/workflows/` exists but currently empty.

## Setup Commands
- Frontend install:
  - `cd Frontend/front-sistema-apuestas && npm install`
- Backend restore/build:
  - `cd Backend/sistema-de-apuestas && dotnet restore SistemaApuestas.slnx`
  - `cd Backend/sistema-de-apuestas && dotnet build SistemaApuestas.slnx`
- Full stack with Docker:
  - `docker compose up -d --build`

## Build / Lint / Test Commands

### Frontend (`Frontend/front-sistema-apuestas`)
- Dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- Preview build: `npm run preview`

### Backend (`Backend/sistema-de-apuestas`)
- Build solution: `dotnet build SistemaApuestas.slnx`
- Run API project:
  - `dotnet run --project src/SistemaApuestas.Api/SistemaApuestas.Api.csproj`

### Tests (current state)
- No backend test projects (`*Test*.csproj`/`*Tests*.csproj`) detected.
- No frontend test runner script (`test`) detected in `package.json`.
- If you add tests, keep commands predictable and document them in this file.

## Single-Test Execution (important)

### Backend single test (when test project exists)
- Run one test project:
  - `dotnet test path/to/Project.Tests.csproj`
- Run one test method:
  - `dotnet test path/to/Project.Tests.csproj --filter "FullyQualifiedName~Namespace.ClassName.TestMethod"`
- Run tests for one class:
  - `dotnet test path/to/Project.Tests.csproj --filter "FullyQualifiedName~Namespace.ClassName"`

### Frontend single test (if Vitest/Jest is added)
- Typical Vitest single file:
  - `npm run test -- src/path/to/file.test.ts`
- Typical Vitest single case:
  - `npm run test -- -t "test name substring"`
- Typical Jest single case:
  - `npm run test -- src/path/to/file.test.ts -t "test name substring"`

## Architecture Conventions

### Backend layering (keep strict)
- `Domain`: entities and core business model.
- `Application`: DTOs, interfaces, repositories contracts, services, hubs.
- `Infrastructure`: EF Core persistence, repository implementations, migrations.
- `Api`: controllers, DI wiring, middleware, authentication, hosted services.
- Dependency direction should remain inward (API/Infrastructure depend on Application/Domain).

### Frontend structure
- `src/Components` grouped by feature and shared/common UI.
- `src/Context` holds global auth/session state (`AuthContext`).
- `src/Global/Api.ts` centralizes fetch wrapper and auth header behavior.
- `src/Routes` defines route trees and protected-route behavior.

## Code Style Guidelines

### General
- Prefer small, targeted edits over broad refactors.
- Preserve Spanish domain vocabulary in identifiers where already established.
- Avoid dead code, duplicate helper functions, and commented-out blocks.
- Do not add dependencies unless necessary and requested.

### Frontend TypeScript / React
- Compiler mode is strict (`strict: true`, `noUnusedLocals`, `noUnusedParameters`).
- Follow existing Prettier config:
  - `semi: true`
  - `singleQuote: true`
  - `trailingComma: all`
  - `printWidth: 80`
  - `tabWidth: 2`
- ESLint is authoritative and includes Prettier via `eslint-plugin-prettier`.
- Respect React Hooks rules; do not suppress `react-hooks` warnings unless unavoidable.
- Use explicit interfaces/types for API payloads and responses.
- Prefer `type`-only imports where appropriate (`import type { X } from '...'`).
- Keep API calls centralized through `apiFetch` unless a special case requires otherwise.
- Components: PascalCase file and symbol names.
- Hooks: `useXxx` naming.
- Services/utilities: descriptive names (current code uses `ServiceXxx.ts` patterns).

### Backend C# / .NET
- Target framework is `.NET 10` (`net10.0`); nullable references are enabled.
- Use PascalCase for public types/members; `_camelCase` for private readonly fields.
- Async methods must use `Async` suffix.
- Keep controllers thin: parse request/user context, call service, return HTTP result.
- Keep business rules in Application services, not in controllers.
- Use DTOs for API contracts; avoid returning EF entities directly.
- Repositories in Infrastructure should remain persistence-focused.
- Prefer dependency injection registration in `Program.cs` as done currently.

## Imports and File Organization
- Keep imports grouped and minimal.
- Remove unused imports immediately.
- In C#, keep `using` directives clean and avoid redundant namespace imports.
- In TS/TSX, maintain consistent relative import style used by neighboring files.

## Naming Conventions
- Backend entities/DTOs/services: PascalCase (`Usuario`, `SalaService`, `CrearSalaDto`).
- Backend interfaces: `I` prefix (`ISalaService`, `IUsuarioRepository`).
- Frontend components/pages/layouts: PascalCase.
- Frontend variables/functions: camelCase.
- Constants: UPPER_SNAKE_CASE for static constant maps (`ESTADOS_SALA`).

## Error Handling Guidelines
- Current backend pattern: services throw exceptions; controllers translate to HTTP responses.
- Keep error messages user-facing and domain-specific (Spanish tone is acceptable and common here).
- Do not swallow exceptions silently.
- Frontend service calls should propagate errors unless there is a clear UX recovery path.
- In frontend UI, prefer controlled handling and clear feedback instead of generic failures.

## API and Auth Notes
- JWT auth is configured in backend and consumed in frontend via `auth` object in storage.
- `apiFetch` automatically attaches `Authorization: Bearer <token>` if present.
- Keep endpoint casing and route patterns consistent with existing controllers (`/api/Sala/...`, etc.).

## Data and Persistence Notes
- EF Core + PostgreSQL are used; context is `ApplicationDbContext`.
- Migrations live under Infrastructure migrations folder.
- Be careful with monetary fields (`SaldoReal`, `SaldoBono`, `SaldoRecarga`): preserve decimal semantics.

## Validation and Quality Checks Before Finishing
- Frontend change:
  - `npm run lint`
  - `npm run build`
- Backend change:
  - `dotnet build SistemaApuestas.slnx`
  - `dotnet test ...` (if/when tests exist)
- Cross-stack or integration change:
  - `docker compose up -d --build` and verify containers start cleanly.

## Agent Behavior Expectations
- Do not rewrite architecture for style-only reasons.
- Prefer incremental fixes that match existing codebase patterns.
- If adding tests or tooling, also update this `AGENTS.md` with exact commands.
- If a rule file (`.cursorrules`, `.cursor/rules/*`, `.github/copilot-instructions.md`) is added later, treat it as highest-priority local guidance and sync this document.
