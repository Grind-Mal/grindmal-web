import { describe, it, expect, vi } from 'vitest';
import { parseChallengeContent } from '@/lib/github-utils';
import { GitHubChallenge } from '@/lib/github-api';

describe('parseChallengeContent', () => {
  it('should parse challenge content correctly', () => {
    const mockChallenge: GitHubChallenge = {
      weekNumber: 1,
      title: 'week-01',
      fileName: 'week-01.md',
      content: `# Week 01 — Habit Tracker CLI 📝

Build a **simple CLI tool** to track daily habits.
This project is **language-agnostic** — you can implement it in Python, Go, JavaScript, or anything you want.

---

## Beginner Task ✅

- Add a habit
- List all habits
- Mark habit as done
- Simple in-memory storage (no database required)

---

## Intermediate Task 💪

- Persist data to a file (JSON, CSV, or text)
- Show progress stats (e.g., streaks, completion percentage)
- Support removing habits
- Validate input

---

## Advanced Task 🌟

- Add multiple users
- CLI flags for options (--user, --stats, --report)
- Generate weekly report summary
- Write basic tests
- Optional: color-coded output for CLI

---

## Submission

- Fork the repo, create a branch like week-01-yourname
- Add your solution folder with code and README if needed
- Submit a PR to main`,
      downloadUrl: 'https://github.com/Grind-Mal/challenges/raw/main/quests/week-01.md',
      htmlUrl: 'https://github.com/Grind-Mal/challenges/blob/main/quests/week-01.md',
      repo: {
        id: 1,
        name: 'habit-tracker-cli',
        full_name: 'Grind-Mal/habit-tracker-cli',
        description: 'A simple CLI tool for tracking daily habits',
        html_url: 'https://github.com/Grind-Mal/habit-tracker-cli',
        stargazers_count: 42,
        forks_count: 15,
        open_issues_count: 8,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-07T00:00:00Z',
      },
    };

    const result = parseChallengeContent(mockChallenge);

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result.week).toBe(1);
    expect(result.title).toBe('Habit Tracker CLI 📝');
    expect(result.description).toContain('simple CLI tool');
    expect(result.description).toContain('language-agnostic');
    expect(result.tags).toContain('CLI');
    expect(result.tags).toContain('Any Language');
    expect(result.repoUrl).toBe('https://github.com/Grind-Mal/habit-tracker-cli');
    expect(result.stars).toBe(42);
    expect(result.forks).toBe(15);
    
    // Status should be one of the valid values
    expect(['active', 'completed', 'upcoming']).toContain(result.status);
    
    // Dates should be in the correct format
    expect(result.startDate).toMatch(/^[A-Za-z]{3} \d{1,2}$/);
    expect(result.endDate).toMatch(/^[A-Za-z]{3} \d{1,2}$/);
  });

  it('should handle missing repo gracefully', () => {
    const mockChallenge: GitHubChallenge = {
      weekNumber: 2,
      title: 'week-02',
      fileName: 'week-02.md',
      content: '# Week 02 — API Server 🚀\n\nBuild a REST API server.',
      downloadUrl: 'https://github.com/Grind-Mal/challenges/raw/main/quests/week-02.md',
      htmlUrl: 'https://github.com/Grind-Mal/challenges/blob/main/quests/week-02.md',
      repo: null,
    };

    const result = parseChallengeContent(mockChallenge);

    expect(result).toBeDefined();
    expect(result.id).toBe(2);
    expect(result.week).toBe(2);
    expect(result.repoUrl).toBe('https://github.com/Grind-Mal/challenges');
    expect(result.stars).toBe(0);
    expect(result.forks).toBe(0);
  });
});