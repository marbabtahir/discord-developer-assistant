/**
 * Standalone script to register slash commands with Discord.
 * Run: npm run register
 * Requires: APPLICATION_ID, BOT_TOKEN in .env (no MongoDB needed)
 */

import 'dotenv/config';
import { slashCommands } from '../commands';
import { REST, Routes } from 'discord.js';

const applicationId = process.env.APPLICATION_ID ?? '';
const botToken = process.env.BOT_TOKEN ?? '';
if (!applicationId || !botToken) {
  console.error('Missing APPLICATION_ID or BOT_TOKEN in .env');
  process.exit(1);
}

async function main(): Promise<void> {
  const rest = new REST().setToken(botToken);
  const body = slashCommands;

  try {
    console.log(`Registering ${body.length} application (/) commands.`);
    const data = await rest.put(
      Routes.applicationCommands(applicationId),
      { body }
    );
    console.log(
      `Successfully registered ${Array.isArray(data) ? data.length : 0} commands.`
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
