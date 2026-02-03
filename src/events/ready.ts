/**
 * Fired when the bot is ready. Register slash commands and log.
 */

import type { Client } from 'discord.js';
import { logger } from '../utils';

export function handleReady(client: Client<true>): void {
  logger.info(`Logged in as ${client.user.tag}`);
  logger.info(`Serving ${client.guilds.cache.size} guild(s)`);
}
