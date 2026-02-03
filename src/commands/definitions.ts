/**
 * Slash command definitions for Discord Application Commands API.
 * Used when registering commands (PUT /applications/:id/commands).
 * Names and options must match the handlers.
 */

import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

export const slashCommands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [
  {
    name: 'analyze-code',
    description: 'Analyze a code snippet for issues, quality, and improvement suggestions',
    options: [
      {
        name: 'code',
        description: 'Code snippet to analyze',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'generate-docs',
    description: 'Generate documentation for given code',
    options: [
      {
        name: 'code',
        description: 'Code snippet to document',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'error-explain',
    description: 'Explain an error message or stack trace in simple language',
    options: [
      {
        name: 'error',
        description: 'Error message or stack trace',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'github-analyze',
    description: 'Analyze a public GitHub repository (tech stack, structure, suggestions)',
    options: [
      {
        name: 'url',
        description: 'Public GitHub repository URL',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'project-health',
    description: 'Evaluate repository activity and productivity insights',
    options: [
      {
        name: 'url',
        description: 'Public GitHub repository URL',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'explain',
    description: 'Explain a concept at different complexity levels (Beginner / Intermediate / Senior)',
    options: [
      {
        name: 'concept',
        description: 'Concept to explain (e.g. async await)',
        type: 3,
        required: true,
      },
      {
        name: 'level',
        description: 'Explanation complexity level',
        type: 3,
        required: true,
        choices: [
          { name: 'Beginner', value: 'beginner' },
          { name: 'Intermediate', value: 'intermediate' },
          { name: 'Senior', value: 'senior' },
        ],
      },
    ],
  },
];
