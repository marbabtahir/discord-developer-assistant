/**
 * OpenAI client wrapper. Uses gpt-3.5-turbo by default (configurable via OPENAI_MODEL).
 */

import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

export const DEFAULT_MODEL = config.openaiModel;

export async function chat(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  model: string = DEFAULT_MODEL
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
  });
  const content = completion.choices[0]?.message?.content;
  return content ?? '';
}

export { openai };
