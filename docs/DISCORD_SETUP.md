# Discord Developer Portal Setup Guide

This guide walks you through configuring your application in the [Discord Developer Portal](https://discord.com/developers/applications) so the Developer Assistant bot works correctly. It follows the official docs:

- [Getting Started](https://discord.com/developers/docs/quick-start/getting-started)
- [API Reference](https://discord.com/developers/docs/reference)

---

## 1. Create or Select Your Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications).
2. Click **New Application** (or select an existing one).
3. Enter a name (e.g. **Developer Assistant**) and create.

You will land on **General Information**. Keep this tab open; you will need values from here for `.env`.

---

## 2. General Information (Credentials for `.env`)

On the **General Information** page:

| Field | Use in `.env` | Notes |
|-------|----------------|--------|
| **Application ID** | `APPLICATION_ID` | Copy and paste into `.env`. |
| **Public Key** | `PUBLIC_KEY` | Used to verify requests from Discord (e.g. interactions webhooks). Copy into `.env`. |

Do **not** put your Bot Token here; that comes from the Bot page (see below).

---

## 3. Bot Section – What to Select

Open the **Bot** page in the left sidebar: [Bot](https://discord.com/developers/applications/select/bot).

### 3.1 Reset Token → `BOT_TOKEN`

1. Under **Token**, click **Reset Token** to generate a new bot token.
2. Copy the token **once** (Discord will not show it again).
3. In your project root, add to `.env`:
   ```env
   BOT_TOKEN=your_token_here
   ```
4. **Never** commit `.env` or share your token. Treat it like a password.

### 3.2 Privileged Gateway Intents

The bot needs certain **Gateway intents** to receive events. Some are **privileged** and must be enabled in the portal.

Enable **only** what you need:

| Intent | Enable? | Why |
|--------|--------|-----|
| **Presence Intent** | ❌ No | Not needed for this bot. |
| **Server Members Intent** | ❌ No | Not required for slash commands. |
| **Message Content Intent** | ❌ No | Not required for this bot. |

**Steps:**

1. On the **Bot** page, scroll to **Privileged Gateway Intents**.
2. Leave all intents **OFF** (no privileged intents required).

Reference: [Gateway Intents](https://discord.com/developers/docs/events/gateway#gateway-intents), [Privileged Intents](https://discord.com/developers/docs/events/gateway#privileged-intents).

### 3.3 Other Bot Settings (Optional)

- **Public Bot**: Off unless you want it listed publicly.
- **OAuth2 → Require OAuth2 Code Grant**: Off for normal bot invite flow.
- **Token regeneration**: If you lose the token or it leaks, use **Reset Token** and update `BOT_TOKEN` in `.env`.

---

## 4. Installation & OAuth2 – Scopes and Permissions

Go to **OAuth2** → **URL Generator** (or **Installation** in the sidebar, depending on layout).

### 4.1 Scopes

Select:

| Scope | Purpose |
|-------|--------|
| **applications.commands** | So the bot can register and use slash commands. |
| **bot** | So the bot can join the server and use bot permissions. |

Reference: [OAuth2 Scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes).

### 4.2 Bot Permissions

After selecting **bot**, a **Bot Permissions** list appears. Select:

| Permission | Why |
|------------|-----|
| **Send Messages** | Required to reply in channels. |
| **Use Application Commands** | Required for slash commands (also implied by `applications.commands` scope). |
| **Read Message History** | Optional; useful if you add features that need to read channel context. |
| **Embed Links** | So the bot can send rich embeds (e.g. for analysis results). |

Optional (only if you add features that need them):

- **Attach Files** – if the bot will upload files.
- **Add Reactions** – if you use reactions for UX.

**Do not** enable **Administrator**; use the minimum permissions above.

Reference: [Permissions](https://discord.com/developers/docs/topics/permissions).

### 4.3 Installation Contexts (if available)

Under **Installation** or similar:

- **Guild Install** (Add to server): **On** – so servers can add the bot.
- **User Install** (Add to user): Optional – only if you want users to use the bot in DMs without adding it to a server.

For a typical server-based Developer Assistant, **Guild Install** is enough.

### 4.4 Install / Invite URL

After selecting scopes and permissions, copy the **Generated URL** and use it to add the bot:

- **To a server**: Open the URL, choose “Add to Server”, pick the server, authorize.
- **To your user** (only if you enabled User Install): Use “Add to my apps” or similar.

Reference: [Installation](https://discord.com/developers/docs/quick-start/getting-started#installing-your-app).

---

## 5. Summary – What You Need in the Portal

| Location | What to select |
|----------|-----------------|
| **General Information** | Copy **Application ID** → `APPLICATION_ID`, **Public Key** → `PUBLIC_KEY`. |
| **Bot** | Reset Token → `BOT_TOKEN`. No privileged intents required. |
| **OAuth2 / Installation** | Scopes: **applications.commands**, **bot**. Permissions: **Send Messages**, **Use Application Commands**, **Read Message History**, **Embed Links**. |

---

## 6. Verify `.env`

Your `.env` should contain at least:

```env
APPLICATION_ID=your_application_id
BOT_TOKEN=your_bot_token
PUBLIC_KEY=your_public_key
OPENAI_API_KEY=your_openai_key
MONGODB_URI=your_mongodb_uri
```

Then run:

```bash
npm run build
npm run start
```

The bot should connect and register slash commands. If you see intent or permission errors, double-check the **Bot** intents and **OAuth2** permissions above.

---

## 7. Official Documentation Links

- [Getting Started](https://discord.com/developers/docs/quick-start/getting-started)
- [API Reference](https://discord.com/developers/docs/reference)
- [Gateway & Intents](https://discord.com/developers/docs/events/gateway)
- [Application Commands](https://discord.com/developers/docs/interactions/application-commands)
- [OAuth2 Scopes](https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes)
- [Permissions](https://discord.com/developers/docs/topics/permissions)
