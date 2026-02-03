/**
 * Central configuration and environment validation.
 * All env vars are read here; fail fast if required ones are missing.
 */

import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] ?? defaultValue;
}

export const config = {
  /** Discord Application ID (Developer Portal → General Information) */
  applicationId: requireEnv('APPLICATION_ID'),
  /** Discord Bot Token (Developer Portal → Bot → Reset Token) */
  botToken: requireEnv('BOT_TOKEN'),
  /** Discord Public Key (Developer Portal → General Information) – for request verification */
  publicKey: optionalEnv('PUBLIC_KEY', ''),
  /** OpenAI API key */
  openaiApiKey: requireEnv('OPENAI_API_KEY'),
  /** MongoDB connection string. Required for skill scoring and user data. */
  mongodbUri: requireEnv('MONGODB_URI'),
  /** Node environment */
  nodeEnv: optionalEnv('NODE_ENV', 'development'),
  /** OpenAI model for chat (can be overridden per feature later) */
  openaiModel: optionalEnv('OPENAI_MODEL', 'gpt-3.5-turbo'),
} as const;

export type Config = typeof config;
