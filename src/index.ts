/**
 * Developer Assistant – Discord Bot
 * Entry point: load config, connect DB, create client, register commands, handle events.
 */

import { Client, GatewayIntentBits, Partials } from 'discord.js';
import { config } from './config';
import { connectDatabase } from './database';
import { handleReady } from './events/ready';
import { handleInteractionCreate } from './events/interactionCreate';
import { slashCommands } from './commands';
import { REST, Routes } from 'discord.js';
import { logger } from './utils';

async function registerCommands(): Promise<void> {
  const rest = new REST().setToken(config.botToken);
  await rest.put(Routes.applicationCommands(config.applicationId), {
    body: slashCommands,
  });
  logger.info(`Registered ${slashCommands.length} slash command(s).`);
}

async function main(): Promise<void> {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.DirectMessages,
    ],
    partials: [Partials.Channel],
  });

  client.once('clientReady', async (c) => {
    handleReady(c);
    try {
      await registerCommands();
    } catch (err) {
      logger.error('Failed to register commands', err);
    }
  });

  client.on('interactionCreate', handleInteractionCreate);

  try {
    await connectDatabase();
    logger.info('Database connected.');
  } catch (err) {
    logger.error('Database connection failed', err);
    process.exit(1);
  }

  await client.login(config.botToken);
}

main().catch((err) => {
  logger.error('Fatal error', err);
  process.exit(1);
});
