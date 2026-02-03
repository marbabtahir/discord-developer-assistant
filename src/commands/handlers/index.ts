/**
 * Slash command handlers. Each handler receives the interaction and options.
 * Handlers are responsible for deferring if needed, calling services, and replying.
 */

import type { ChatInputCommandInteraction } from 'discord.js';
import {
  analyzeCode,
  generateDocs,
  explainError,
  explainConcept,
} from '../../services/aiService';
import { getOrCreateUser, incrementCommandUsage } from '../../services/userService';
import { logger } from '../../utils';

type Handler = (
  interaction: ChatInputCommandInteraction,
  options: Record<string, string | number | boolean | undefined>
) => Promise<void>;

async function safeReply(
  interaction: ChatInputCommandInteraction,
  content: string,
  ephemeral = false
): Promise<void> {
  const payload = { content, ephemeral };
  if (content.length > 2000) {
    const chunks = content.match(/.{1,2000}/gs) ?? [content];
    await interaction.editReply({ content: chunks[0] });
    for (let i = 1; i < chunks.length; i++) {
      await interaction.followUp({ content: chunks[i], ephemeral });
    }
  } else {
    await interaction.editReply({ content });
  }
}

export const handlers: Record<string, Handler> = {
  'analyze-code': async (interaction, options) => {
    const code = String(options.code ?? '');
    if (!code.trim()) {
      await interaction.editReply({ content: 'Please provide a code snippet.' });
      return;
    }
    await interaction.deferReply();
    try {
      const result = await analyzeCode(code);
      const userId = interaction.user.id;
      const username = interaction.user.username;
      await incrementCommandUsage(userId, username, 'analyzeCode');
      await safeReply(interaction, result);
    } catch (err) {
      logger.error('analyze-code error', err);
      await interaction.editReply({
        content: 'Something went wrong while analyzing the code. Please try again.',
      });
    }
  },

  'generate-docs': async (interaction, options) => {
    const code = String(options.code ?? '');
    if (!code.trim()) {
      await interaction.editReply({ content: 'Please provide a code snippet.' });
      return;
    }
    await interaction.deferReply();
    try {
      const result = await generateDocs(code);
      await getOrCreateUser(interaction.user.id, interaction.user.username);
      await incrementCommandUsage(
        interaction.user.id,
        interaction.user.username,
        'generateDocs'
      );
      await safeReply(interaction, result);
    } catch (err) {
      logger.error('generate-docs error', err);
      await interaction.editReply({
        content: 'Something went wrong while generating docs. Please try again.',
      });
    }
  },

  'error-explain': async (interaction, options) => {
    const error = String(options.error ?? '');
    if (!error.trim()) {
      await interaction.editReply({ content: 'Please provide an error message or stack trace.' });
      return;
    }
    await interaction.deferReply();
    try {
      const result = await explainError(error);
      await getOrCreateUser(interaction.user.id, interaction.user.username);
      await incrementCommandUsage(
        interaction.user.id,
        interaction.user.username,
        'errorExplain'
      );
      await safeReply(interaction, result);
    } catch (err) {
      logger.error('error-explain error', err);
      await interaction.editReply({
        content: 'Something went wrong while explaining the error. Please try again.',
      });
    }
  },

  'github-analyze': async (interaction) => {
    await interaction.deferReply();
    await interaction.editReply({
      content:
        'GitHub repository analysis is not implemented yet. It will analyze tech stack, project structure, and improvement suggestions. Stay tuned!',
    });
  },

  'project-health': async (interaction) => {
    await interaction.deferReply();
    await interaction.editReply({
      content:
        'Project health evaluation is not implemented yet. It will show commit activity and productivity insights. Stay tuned!',
    });
  },

  'explain': async (interaction, options) => {
    const concept = String(options.concept ?? '');
    const level = String(options.level ?? 'beginner');
    if (!concept.trim()) {
      await interaction.editReply({ content: 'Please provide a concept to explain.' });
      return;
    }
    const validLevels = ['beginner', 'intermediate', 'senior'] as const;
    const l = validLevels.includes(level as (typeof validLevels)[number])
      ? (level as (typeof validLevels)[number])
      : 'beginner';
    await interaction.deferReply();
    try {
      const result = await explainConcept(concept, l);
      await getOrCreateUser(interaction.user.id, interaction.user.username);
      await incrementCommandUsage(
        interaction.user.id,
        interaction.user.username,
        'explain'
      );
      await safeReply(interaction, result);
    } catch (err) {
      logger.error('explain error', err);
      await interaction.editReply({
        content: 'Something went wrong while explaining. Please try again.',
      });
    }
  },
};
