# Contributing to Developer Assistant

Thank you for considering contributing. This project is open-source and welcomes contributions.

---

## Development Setup

1. Fork and clone the repository.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in your credentials (see [docs/DISCORD_SETUP.md](docs/DISCORD_SETUP.md)).
4. Run `npm run build` to compile TypeScript.
5. Run `npm run dev:watch` for development with auto-reload.

---

## Code Style

- Use TypeScript with strict mode (as in `tsconfig.json`).
- Prefer async/await over raw Promises.
- Keep command handlers in `src/commands/handlers/` and command definitions in `src/commands/definitions.ts`.
- Add new services in `src/services/` and wire them from command handlers.

---

## Adding a New Command

1. Add the command payload to `src/commands/definitions.ts` (name, description, options).
2. Add a handler in `src/commands/handlers/index.ts` (key = command name).
3. Optionally add a service in `src/services/` and call it from the handler.
4. Update the README Features section if the command is user-facing.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for more detail.

---

## Pull Requests

- Keep PRs focused on one feature or fix.
- Ensure `npm run build` and `npm run typecheck` pass.
- Update documentation if you change behavior or add options.

---

## Reporting Issues

Open an issue with:

- Steps to reproduce
- Expected vs actual behavior
- Node version and OS (if relevant)

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).
