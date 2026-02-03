/**
 * AI service: analyze code, generate docs, explain errors, explain concepts.
 * Uses OpenAI (gpt-3.5-turbo) via the ai/openai module.
 */

import { chat, DEFAULT_MODEL } from '../ai';

export async function analyzeCode(code: string): Promise<string> {
  const system = `You are a senior developer. Analyze the given code and respond with:
1. Detected programming language
2. Identified issues (bugs, style, security)
3. Improvement suggestions
4. Refactoring recommendations
5. Code quality and security feedback
Keep the response clear and structured. Use markdown where helpful.`;
  return chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: `Analyze this code:\n\n\`\`\`\n${code}\n\`\`\`` },
    ],
    DEFAULT_MODEL
  );
}

export async function generateDocs(code: string): Promise<string> {
  const system = `You are a technical writer. Generate documentation for the given code. Include:
1. Function/component description
2. Parameter explanation
3. Return value explanation
4. Usage example if applicable
Use clear markdown.`;
  return chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: `Document this code:\n\n\`\`\`\n${code}\n\`\`\`` },
    ],
    DEFAULT_MODEL
  );
}

export async function explainError(errorText: string): Promise<string> {
  const system = `You are a patient developer mentor. Explain the given error or stack trace in simple language. Include:
1. What the error means
2. Likely root cause
3. Step-by-step solutions
Be concise and actionable.`;
  return chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: `Explain this error:\n\n${errorText}` },
    ],
    DEFAULT_MODEL
  );
}

export async function explainConcept(
  concept: string,
  level: 'beginner' | 'intermediate' | 'senior'
): Promise<string> {
  const levelInstructions = {
    beginner: 'Explain in very simple terms, avoid jargon, use analogies.',
    intermediate: 'Assume some programming knowledge; include technical details.',
    senior: 'Be concise and assume deep experience; focus on edge cases and best practices.',
  };
  const system = `You are a programming educator. Explain the concept "${concept}" at ${level} level. ${levelInstructions[level]} Use markdown.`;
  return chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: `Explain: ${concept}` },
    ],
    DEFAULT_MODEL
  );
}

export async function analyzeGitHubRepo(context: string): Promise<string> {
  const system = `You are a senior developer reviewing a GitHub repository. Given the repo metadata, languages, root structure, and README excerpt below, produce a concise analysis with:
1. **Tech stack** – Main languages and likely frameworks/tools (infer from structure and README).
2. **Project structure** – Brief overview of the layout and key directories/files.
3. **Improvement suggestions** – 3–5 concrete tips (docs, structure, tooling, or best practices).
Use markdown. Be concise and actionable.`;
  return chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: `Repository data:\n\n${context}` },
    ],
    DEFAULT_MODEL
  );
}

export async function analyzeProjectHealth(context: string): Promise<string> {
  const system = `You are a project health analyst. Given the repo metadata, recent commits, and contributors below, produce a short report with:
1. **Commit activity** – How active the repo is (e.g. last 7/30 days), who’s committing.
2. **Productivity insights** – Main contributors, commit frequency, any patterns.
3. **Activity feedback** – One short verdict: e.g. "Healthy and active", "Low recent activity", "Many open issues", etc., and one sentence of advice if relevant.
Use markdown. Be concise.`;
  return chat(
    [
      { role: 'system', content: system },
      { role: 'user', content: `Repository activity data:\n\n${context}` },
    ],
    DEFAULT_MODEL
  );
}
