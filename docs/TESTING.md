# Testing the Developer Assistant Bot

Your bot is running when you see:
- `Database connected.`
- `Logged in as Developer Assistant#3994`
- `Registered 6 slash command(s).`

Follow these steps to test everything in Discord.

---

## 1. Open your Discord server

Use the server where you added the bot (the one it’s “Serving 1 guild(s)” for).

---

## 2. See the slash commands

1. In any **text channel**, click the **slash (/) icon** in the message box (or type `/`).
2. You should see **Developer Assistant** (or your app name) and its commands.
3. If you don’t see them, wait 1–2 minutes or restart Discord, then try again.

---

## 3. Test each command

### `/analyze-code`

- Type: `/analyze-code` and choose the command.
- For **code**, paste a short snippet, e.g.:
  ```js
  function add(a,b){return a+b}
  ```
- Send. You should get a reply with language detection, issues, and suggestions.

### `/generate-docs`

- Use: `/generate-docs` with a **code** option (e.g. a small function).
- Expect: description, parameters, return value, usage example.

### `/error-explain`

- Use: `/error-explain` and paste an **error** (or fake one), e.g.:
  ```
  TypeError: Cannot read property 'x' of undefined
  ```
- Expect: plain-language explanation and suggested fix.

### `/explain`

- Use: `/explain` with:
  - **concept**: e.g. `async await`
  - **level**: Beginner, Intermediate, or Senior
- Expect: explanation suited to the level.

### `/github-analyze` and `/project-health`

- Use with a **url** (e.g. `https://github.com/discordjs/discord.js`).
- Expect: a “not implemented yet” style message (stubs for future GitHub integration).

---

## 4. Quick checklist

| Command            | What to do                    | Expected result                          |
|--------------------|-------------------------------|------------------------------------------|
| `/analyze-code`   | Paste a small code snippet    | Analysis with issues/suggestions         |
| `/generate-docs`  | Paste a function              | Docs (params, return, example)           |
| `/error-explain`  | Paste an error message        | Explanation and fix steps                |
| `/explain`        | Concept + level               | Explanation at that level                |
| `/github-analyze`| Any public repo URL            | “Not implemented yet” (stub)             |
| `/project-health` | Any public repo URL            | “Not implemented yet” (stub)             |

---

## 5. Check MongoDB (optional)

If you use MongoDB Compass or similar:

1. Connect to `mongodb://localhost:27017` (or your Atlas URI).
2. Open the **developer-assistant** database.
3. After using commands, you should see a **users** collection with documents (e.g. `discordId`, `username`, `commandUsage`, `skillScore`).

---

## 6. If something fails

- **Commands don’t appear**  
  Wait a minute, restart Discord, or run `npm run register` and restart the bot.

- **“Unknown interaction” or timeout**  
  OpenAI or the bot may be slow. Try again; if it keeps failing, check the terminal for errors.

- **Database errors**  
  Ensure MongoDB is running and `MONGODB_URI` in `.env` is correct.

Once these tests pass, the bot is ready for normal use and for adding features (e.g. GitHub integration).
