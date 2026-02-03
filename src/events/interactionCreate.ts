/**
 * Handle incoming interactions (slash commands).
 * Routes by command name to the appropriate handler.
 */

import type { Interaction } from 'discord.js';
import { handlers } from '../commands';
import { logger } from '../utils';

function getOptions(
  interaction: Interaction
): Record<string, string | number | boolean | undefined> {
  if (!interaction.isChatInputCommand()) return {};
  const options: Record<string, string | number | boolean | undefined> = {};
  for (const option of interaction.options.data) {
    if (option.name && option.value !== undefined) {
      options[option.name] = option.value as string | number | boolean;
    }
  }
  return options;
}

export async function handleInteractionCreate(
  interaction: Interaction
): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;
  const handler = handlers[commandName];

  if (!handler) {
    logger.warn(`No handler for command: ${commandName}`);
    if (interaction.replied || interaction.deferred) return;
    await interaction.reply({
      content: `Unknown command: \`/${commandName}\`.`,
      ephemeral: true,
    }).catch(() => { });
    return;
  }

  const options = getOptions(interaction);
  try {
    await handler(interaction, options);
  } catch (err) {
    logger.error(`Handler error for /${commandName}`, err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: 'An error occurred while running this command.',
        ephemeral: true,
      }).catch(() => { });
    } else {
      await interaction.editReply({
        content: 'An error occurred while running this command.',
      }).catch(() => { });
    }
  }
}
