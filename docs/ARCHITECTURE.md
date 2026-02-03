# Architecture Overview

This document describes the project structure and how to extend the bot.

---

## Directory Layout

```
src/
├── config/          # Environment and configuration
├── commands/        # Slash command definitions and handlers
├── events/          # Discord event handlers (ready, interactionCreate)
├── services/        # Business logic (AI, user/skill tracking)
├── database/        # MongoDB connection and models
├── ai/              # OpenAI client wrapper
├── utils/           # Helpers (logger, etc.)
├── scripts/         # Standalone scripts (e.g. register-commands)
└── index.ts         # Entry point
```

- **commands/** – Slash command payloads for Discord (`definitions.ts`) and handlers (`handlers/index.ts`). To add a command: add its payload to `definitions.ts` and a handler in `handlers/index.ts`.
- **events/** – Discord.js events. `ready` runs on login; `interactionCreate` routes slash commands to handlers.
- **services/** – Use these from command handlers. Add new features (e.g. GitHub API) as new service modules.
- **database/** – Mongoose models. User model holds `discordId`, `username`, `skillScore`, `badges`, `commandUsage`.
- **ai/** – OpenAI wrapper. Change `OPENAI_MODEL` in `.env` or pass a different model in `chat()`.

---

## Adding a New Slash Command

1. **Define the command** in `src/commands/definitions.ts` (name, description, options per [Discord Application Commands](https://discord.com/developers/docs/interactions/application-commands)).
2. **Add a handler** in `src/commands/handlers/index.ts`: key = command name, value = async function that receives `interaction` and `options`, calls `deferReply()` if needed, then calls your service and replies.
3. Restart the bot (or run `npm run register` to only re-register commands). The bot also registers commands on startup.

---

## Environment Variables

See `.env.example` and `docs/DISCORD_SETUP.md`. Required: `APPLICATION_ID`, `BOT_TOKEN`, `PUBLIC_KEY`, `OPENAI_API_KEY`, `MONGODB_URI`. Optional: `NODE_ENV`, `OPENAI_MODEL`, `LOG_LEVEL`.

---

## Discord Intents and Permissions

- **Gateway intents**: `Guilds`, `GuildMessages`, `DirectMessages`. No privileged intents required.
- **Bot permissions**: Send Messages, Use Application Commands, Read Message History, Embed Links. See `docs/DISCORD_SETUP.md` for OAuth2 scopes and invite URL.

---

## Extending Features

- **GitHub analyze / project-health**: Add a `githubService.ts` that calls GitHub API (e.g. repo metadata, commits), then call it from the existing handlers and format the response for Discord.
- **Badges**: Extend `userService` to compute badges from `commandUsage` and `skillScore`, and update the User model or a separate “levels” helper.
- **More AI features**: Add functions in `aiService.ts` and wire them from new or existing command handlers.
