import { execFile as execFileCb } from 'node:child_process';
import { promisify } from 'node:util';
import { paths } from '../paths.js';

const execFile = promisify(execFileCb);

export interface Commit {
  sha: string;
  shortSha: string;
  date: string;
  author: string;
  subject: string;
  files: number;
}

export interface GitRecentReport {
  commits: Commit[];
  branch: string | null;
  unstaged: number;     // count of uncommitted changes
}

export async function readRecentCommits(limit = 30): Promise<GitRecentReport> {
  let commits: Commit[] = [];
  let branch: string | null = null;
  let unstaged = 0;

  try {
    const { stdout: branchOut } = await execFile('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      cwd: paths.root, timeout: 5000,
    });
    branch = branchOut.trim() || null;
  } catch { /* not a git repo or git not available */ }

  try {
    const { stdout: statusOut } = await execFile('git', ['status', '--porcelain'], {
      cwd: paths.root, timeout: 5000,
    });
    unstaged = statusOut.split(/\r?\n/).filter(Boolean).length;
  } catch { /* */ }

  try {
    const { stdout } = await execFile('git', [
      'log', `-n${limit}`, '--pretty=format:%H|%ai|%an|%s', '--shortstat',
    ], { cwd: paths.root, timeout: 8000, maxBuffer: 4 * 1024 * 1024 });

    const lines = stdout.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!line.includes('|')) continue;
      const [sha, date, author, subject] = line.split('|');
      if (!sha) continue;
      // shortstat is on the next non-empty line typically
      let files = 0;
      for (let j = i + 1; j < Math.min(i + 4, lines.length); j++) {
        const m = lines[j].match(/(\d+) files? changed/);
        if (m) { files = Number(m[1]); break; }
      }
      commits.push({
        sha, shortSha: sha.slice(0, 7),
        date, author, subject, files,
      });
    }
  } catch { /* */ }

  return { commits, branch, unstaged };
}
