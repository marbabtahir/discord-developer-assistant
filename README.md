# 🚀 Developer Assistant – Discord Bot

AI-powered Discord bot for developer communities.  
Built with **Node.js, TypeScript, discord.js, MongoDB, and OpenAI (gpt-3.5-turbo)**.

This bot analyzes code, explains errors, generates documentation, evaluates GitHub repositories, and tracks developer skills directly inside Discord.

---

# 📌 Features

## 1 `/analyze-code`

Analyzes a provided code snippet.

**Input:** Code snippet  
**Output:**
- Detected programming language
- Identified issues
- Improvement suggestions
- Refactoring recommendations
- Code quality & security feedback

Powered by OpenAI `gpt-3.5-turbo`.

---

## 2️ `/generate-docs`

Generates documentation for given code.

**Input:** Code snippet  
**Output:**
- Function description
- Parameter explanation
- Return value explanation
- Usage example (if applicable)

---

## 3️ `/error-explain`

Explains stack traces or error messages in simple language.

**Input:** Error message / stack trace  
**Output:**
- Root cause explanation
- What the error means
- Possible solution steps

---

## 4️ `/github-analyze`

Analyzes a public GitHub repository.

**Input:** Public GitHub repository URL  
**Output:**
- Tech stack summary
- Project structure feedback
- Improvement suggestions

---

## 5️ `/project-health`

Evaluates repository activity.

**Input:** Public GitHub repository URL  
**Output:**
- Commit activity overview
- Productivity insights
- Activity feedback

---

## 6️ Developer Skill Scoring System

Tracks user activity and assigns levels based on usage.

Tracked actions:
- Code analysis usage
- Documentation generation
- GitHub analysis

Example badges:
- Backend Level 1 / 2 / 3
- Debugging Specialist
- Documentation Pro

All data stored in MongoDB.

---

## 7️ Multi-Level Explanation Mode

Users can request explanations in different complexity levels:

- Beginner
- Intermediate
- Senior

Example:

```bash
/explain concept="async await" level=Beginner
```

The response tone changes according to selected level.

---

## 8️ AI-Based Code Quality Detection

During code analysis, the bot checks for:

- Hardcoded secrets
- Poor naming conventions
- Large functions
- Bad practices
- Security risks

---

# 🛠 Tech Stack

- Node.js
- TypeScript
- discord.js
- MongoDB
- OpenAI API (gpt-3.5-turbo)
- dotenv

---

# 📚 Documentation

- **[Discord Developer Portal Setup](docs/DISCORD_SETUP.md)** – Step-by-step guide: what to select in the Bot section (intents, token), Installation (scopes, permissions), and how to get `APPLICATION_ID`, `BOT_TOKEN`, `PUBLIC_KEY`. **Read this before running the bot.**
- **[GitHub Token (optional)](docs/GITHUB_TOKEN.md)** – How to get `GITHUB_TOKEN` for `/github-analyze` and `/project-health` (higher API rate limit).
- **[Architecture](docs/ARCHITECTURE.md)** – Project structure and how to add new commands or extend features.

---

# ⚙️ Installation

## 1️ Clone Repository

```bash
git clone https://github.com/yourusername/developer-ai-assistant.git
cd developer-ai-assistant
```

---

## 2️ Install Dependencies

```bash
npm install
```

---

## 3️ Environment Setup

1. Copy `.env.example` to `.env` in the root directory.
2. Fill in all values. See **[docs/DISCORD_SETUP.md](docs/DISCORD_SETUP.md)** for where to get Discord credentials.

Required variables:

| Variable | Description |
|----------|-------------|
| `APPLICATION_ID` | Discord Developer Portal → General Information |
| `BOT_TOKEN` | Discord Developer Portal → Bot → Reset Token |
| `PUBLIC_KEY` | Discord Developer Portal → General Information |
| `OPENAI_API_KEY` | [OpenAI API Keys](https://platform.openai.com/api-keys) |
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |

---

## 4️ Discord Portal Configuration

Before starting the bot, complete the Discord setup:

1. **Bot** → No privileged intents required (leave all off).
2. **OAuth2 / Installation** → Scopes: `applications.commands`, `bot`. Permissions: **Send Messages**, **Use Application Commands**, **Read Message History**, **Embed Links**.

Full details: **[docs/DISCORD_SETUP.md](docs/DISCORD_SETUP.md)**.

---

## 5️ Build and Start

```bash
npm run build
npm run start
```

The bot will connect to Discord, register slash commands, and listen for interactions.

**Optional:** Register commands only (e.g. after changing command definitions):

```bash
npm run register
```

**Development** (with auto-reload):

```bash
npm run dev:watch
```

---

# 🔐 Required Discord Bot Permissions

The bot needs:

- **Send Messages**
- **Use Application Commands** (slash commands)
- **Read Message History**
- **Embed Links**

See [docs/DISCORD_SETUP.md](docs/DISCORD_SETUP.md) for Bot and OAuth2 setup.

---

# 🗄 Database Structure (MongoDB)

## Users Collection

```json
{
  "discordId": "string",
  "username": "string",
  "skillScore": 0,
  "badges": ["string"],
  "commandUsage": {
    "analyzeCode": 0,
    "generateDocs": 0,
    "githubAnalyze": 0
  },
  "createdAt": "date"
}
```

Tracks user progression and developer level.

---

# 🤖 OpenAI Configuration

Model used:

```
gpt-3.5-turbo
```

API Key is loaded from:

```
process.env.OPENAI_API_KEY
```

No credentials are stored inside source code.

---

# 📂 Project Structure

```
src/
├── config/       # Environment and configuration
├── commands/     # Slash command definitions and handlers
├── events/       # Discord event handlers (ready, interactionCreate)
├── services/     # Business logic (AI, user/skill tracking)
├── database/     # MongoDB connection and models
├── ai/           # OpenAI client wrapper
├── utils/        # Helpers (logger)
├── scripts/      # Standalone scripts (e.g. register-commands)
└── index.ts      # Entry point
```

- `commands/` → Slash command definitions (`definitions.ts`) and handlers (`handlers/`)  
- `events/` → Discord event handlers  
- `services/` → Business logic (AI, user service)  
- `database/` → MongoDB models (User)  
- `ai/` → OpenAI integration  
- `utils/` → Helper functions  

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how to add new commands and extend the bot.  

---

# 🚀 Running in Production

```bash
npm run build
npm run start
```

Ensure:

- MongoDB connection is active
- All environment variables are set
- Discord bot permissions are configured

---

# 📄 License

This project is open-source and available under the MIT License.

