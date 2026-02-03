/**
 * GitHub API service for /github-analyze and /project-health.
 * Fetches public repo metadata, languages, contents, readme, commits, contributors.
 * Optional GITHUB_TOKEN in .env for higher rate limit (5000/hr vs 60/hr).
 */

import { config } from '../config';

const GITHUB_API = 'https://api.github.com';
const USER_AGENT = 'Developer-Assistant-Discord-Bot';

export interface ParsedRepo {
  owner: string;
  repo: string;
}

/**
 * Parse a GitHub repo URL into owner and repo name.
 * Supports: https://github.com/owner/repo, https://github.com/owner/repo/, github.com/owner/repo
 */
export function parseGitHubUrl(url: string): ParsedRepo | null {
  const trimmed = url.trim();
  try {
    const u = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    if (u.hostname !== 'github.com') return null;
    const parts = u.pathname.replace(/^\/+|\/+$/g, '').split('/');
    if (parts.length < 2) return null;
    const [owner, repo] = parts;
    if (!owner || !repo || repo.includes('.')) return null; // skip .git etc.
    return { owner, repo };
  } catch {
    return null;
  }
}

async function fetchGitHub<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': USER_AGENT,
  };
  if (config.githubToken) {
    headers.Authorization = `Bearer ${config.githubToken}`;
  }
  const res = await fetch(`${GITHUB_API}${path}`, { headers });
  if (res.status === 404) {
    throw new Error('Repository not found. Check the URL and that the repo is public.');
  }
  if (res.status === 403) {
    const data = (await res.json().catch(() => ({}))) as { message?: string };
    const msg = data?.message ?? '';
    if (msg.toLowerCase().includes('rate limit')) {
      throw new Error('GitHub API rate limit exceeded. Try again later or add GITHUB_TOKEN to .env (see docs/GITHUB_TOKEN.md).');
    }
    throw new Error('Repository is private or inaccessible.');
  }
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

interface RepoResponse {
  name: string;
  full_name: string;
  description: string | null;
  default_branch: string;
  stargazers_count: number;
  open_issues_count: number;
  pushed_at: string | null;
  updated_at: string;
}

interface ContentItem {
  name: string;
  type: string;
  path?: string;
}

interface ReadmeResponse {
  content: string;
  encoding: string;
}

interface CommitResponse {
  sha: string;
  commit: { message: string; author?: { name?: string; date?: string } };
  author?: { login?: string };
}

interface ContributorResponse {
  login: string;
  contributions: number;
}

/**
 * Fetch repo metadata, languages, root contents, and README for analysis.
 */
export async function getRepoAnalysisData(url: string): Promise<string> {
  const parsed = parseGitHubUrl(url);
  if (!parsed) throw new Error('Invalid GitHub URL. Use format: https://github.com/owner/repo');

  const { owner, repo } = parsed;
  const path = `/repos/${owner}/${repo}`;

  const [repoData, languages, contents, readmeResult] = await Promise.all([
    fetchGitHub<RepoResponse>(path),
    fetchGitHub<Record<string, number>>(`${path}/languages`).catch(() => ({})),
    fetchGitHub<ContentItem[]>(`${path}/contents/`).catch(() => []),
    fetchGitHub<ReadmeResponse>(`${path}/readme`).catch(() => null),
  ]);

  const langList = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([name, bytes]) => `${name}: ${bytes} bytes`)
    .join(', ');
  const structure = Array.isArray(contents)
    ? contents.map((c) => `${c.type === 'dir' ? '[DIR]' : '[FILE]'} ${c.name}`).join('\n')
    : 'Unable to list contents';
  let readmeText = '';
  if (readmeResult?.content && readmeResult.encoding === 'base64') {
    try {
      readmeText = Buffer.from(readmeResult.content, 'base64').toString('utf-8').slice(0, 4000);
    } catch {
      readmeText = '(README could not be decoded)';
    }
  }

  return [
    '## Repo',
    `- Full name: ${repoData.full_name}`,
    `- Description: ${repoData.description ?? 'None'}`,
    `- Default branch: ${repoData.default_branch}`,
    `- Stars: ${repoData.stargazers_count}, Open issues: ${repoData.open_issues_count}`,
    `- Last pushed: ${repoData.pushed_at ?? 'N/A'}`,
    '',
    '## Languages (bytes)',
    langList || 'None detected',
    '',
    '## Root structure',
    structure,
    '',
    '## README (excerpt)',
    readmeText || 'No README',
  ].join('\n');
}

/**
 * Fetch repo metadata, recent commits, and contributors for health/activity.
 */
export async function getRepoHealthData(url: string): Promise<string> {
  const parsed = parseGitHubUrl(url);
  if (!parsed) throw new Error('Invalid GitHub URL. Use format: https://github.com/owner/repo');

  const { owner, repo } = parsed;
  const path = `/repos/${owner}/${repo}`;

  const [repoData, commits, contributors] = await Promise.all([
    fetchGitHub<RepoResponse>(path),
    fetchGitHub<CommitResponse[]>(`${path}/commits?per_page=30`).catch(() => []),
    fetchGitHub<ContributorResponse[]>(`${path}/contributors?per_page=10`).catch(() => []),
  ]);

  const commitLines = Array.isArray(commits)
    ? commits.slice(0, 25).map((c) => {
      const author = c.commit?.author?.name ?? c.author?.login ?? 'Unknown';
      const date = c.commit?.author?.date ?? 'N/A';
      const msg = (c.commit?.message ?? '').split('\n')[0].slice(0, 60);
      return `- ${date.slice(0, 10)} | ${author} | ${msg}`;
    })
    : [];
  const contributorLines = Array.isArray(contributors)
    ? contributors.map((c) => `- ${c.login}: ${c.contributions} commits`).join('\n')
    : 'Unable to fetch contributors';

  return [
    '## Repo',
    `- Full name: ${repoData.full_name}`,
    `- Stars: ${repoData.stargazers_count}, Open issues: ${repoData.open_issues_count}`,
    `- Last pushed: ${repoData.pushed_at ?? 'N/A'}`,
    `- Updated: ${repoData.updated_at}`,
    '',
    '## Recent commits (up to 25)',
    commitLines.length ? commitLines.join('\n') : 'No commits',
    '',
    '## Top contributors',
    contributorLines,
  ].join('\n');
}
