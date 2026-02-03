/**
 * Simple logger. Can be extended to use a proper logging library later.
 */

const prefix = '[DeveloperAssistant]';

export const logger = {
  info: (msg: string, ...args: unknown[]) =>
    console.log(prefix, msg, ...args),
  warn: (msg: string, ...args: unknown[]) =>
    console.warn(prefix, msg, ...args),
  error: (msg: string, ...args: unknown[]) =>
    console.error(prefix, msg, ...args),
};
