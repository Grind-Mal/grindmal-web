import { useQuery } from "@tanstack/react-query";

const GITHUB_ORG = import.meta.env.VITE_GITHUB_ORGANIZATION || "Grind-Mal";
const GITHUB_API_URL =
  import.meta.env.VITE_GITHUB_API_URL || "https://api.github.com";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const CACHE_TIME = parseInt(import.meta.env.VITE_API_CACHE_TIME || "300000");

// Helper function to make GitHub API requests with better error handling
const fetchFromGitHub = async <T>(endpoint: string): Promise<T> => {
  const url = `${GITHUB_API_URL}${endpoint}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  if (GITHUB_TOKEN) {
    headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    // Handle 404 specifically for missing resources
    if (response.status === 404) {
      throw new Error(`Resource not found: ${endpoint}`);
    }
    throw new Error(
      `GitHub API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
};

// Get all repositories in the organization
export const useOrganizationRepos = () => {
  return useQuery({
    queryKey: ["github", "org-repos", GITHUB_ORG],
    queryFn: () => fetchFromGitHub<GitHubRepo[]>(`/orgs/${GITHUB_ORG}/repos`),
    staleTime: CACHE_TIME,
    retry: 3,
    // retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get issues from a specific repository (filter out pull requests)
export const useRepositoryIssues = (repoName: string) => {
  return useQuery({
    queryKey: ["github", "repo-issues", GITHUB_ORG, repoName],
    queryFn: async () => {
      // GitHub issues API returns both issues and pull requests
      const issues = await fetchFromGitHub<GitHubIssue[]>(
        `/repos/${GITHUB_ORG}/${repoName}/issues?state=all`,
      );

      // Filter out pull requests (issues that have pull_request property)
      return issues.filter((issue) => !issue.pull_request);
    },
    staleTime: CACHE_TIME,
    retry: 3,
    enabled: !!repoName,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get pull requests from a specific repository
export const useRepositoryPullRequests = (repoName: string) => {
  return useQuery({
    queryKey: ["github", "repo-prs", GITHUB_ORG, repoName],
    queryFn: () =>
      fetchFromGitHub<GitHubPullRequest[]>(
        `/repos/${GITHUB_ORG}/${repoName}/pulls?state=all`,
      ),
    staleTime: CACHE_TIME,
    retry: 3,
    enabled: !!repoName,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get organization members
export const useOrganizationMembers = () => {
  return useQuery({
    queryKey: ["github", "org-members", GITHUB_ORG],
    queryFn: () => fetchFromGitHub<GitHubUser[]>(`/orgs/${GITHUB_ORG}/members`),
    staleTime: CACHE_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get repository contributors
export const useRepositoryContributors = (repoName: string) => {
  return useQuery({
    queryKey: ["github", "repo-contributors", GITHUB_ORG, repoName],
    queryFn: () =>
      fetchFromGitHub<GitHubContributor[]>(
        `/repos/${GITHUB_ORG}/${repoName}/contributors`,
      ),
    staleTime: CACHE_TIME,
    retry: 3,
    enabled: !!repoName,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get all issues across all organization repositories (filter out pull requests)
export const useAllOrganizationIssues = () => {
  return useQuery({
    queryKey: ["github", "all-org-issues", GITHUB_ORG],
    queryFn: async () => {
      const repos = await fetchFromGitHub<GitHubRepo[]>(
        `/orgs/${GITHUB_ORG}/repos`,
      );

      const allIssues: GitHubIssue[] = [];

      for (const repo of repos) {
        try {
          const issues = await fetchFromGitHub<GitHubIssue[]>(
            `/repos/${GITHUB_ORG}/${repo.name}/issues?state=all`,
          );
          // Filter out pull requests
          const realIssues = issues.filter((issue) => !issue.pull_request);
          allIssues.push(...realIssues);
        } catch (error) {
          console.warn(`Failed to fetch issues for ${repo.name}:`, error);
          // Continue with other repos even if one fails
        }
      }

      return allIssues;
    },
    staleTime: CACHE_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get all pull requests across all organization repositories
export const useAllOrganizationPullRequests = () => {
  return useQuery({
    queryKey: ["github", "all-org-prs", GITHUB_ORG],
    queryFn: async () => {
      const repos = await fetchFromGitHub<GitHubRepo[]>(
        `/orgs/${GITHUB_ORG}/repos`,
      );

      const allPRs: GitHubPullRequest[] = [];

      for (const repo of repos) {
        try {
          const prs = await fetchFromGitHub<GitHubPullRequest[]>(
            `/repos/${GITHUB_ORG}/${repo.name}/pulls?state=all`,
          );
          allPRs.push(...prs);
        } catch (error) {
          console.warn(`Failed to fetch PRs for ${repo.name}:`, error);
          // Continue with other repos
        }
      }

      return allPRs;
    },
    staleTime: CACHE_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get featured repository (most stars or most recent activity)
export const useFeaturedRepository = () => {
  return useQuery({
    queryKey: ["github", "featured-repo", GITHUB_ORG],
    queryFn: async () => {
      const repos = await fetchFromGitHub<GitHubRepo[]>(
        `/orgs/${GITHUB_ORG}/repos?sort=updated&direction=desc`,
      );

      if (repos.length === 0) {
        throw new Error("No repositories found in the organization");
      }

      // Find the repo with most stars, or if tied, most recent activity
      return repos.reduce((featured, current) => {
        if (current.stargazers_count > featured.stargazers_count) {
          return current;
        }
        if (current.stargazers_count === featured.stargazers_count) {
          return new Date(current.updated_at) > new Date(featured.updated_at)
            ? current
            : featured;
        }
        return featured;
      }, repos[0]);
    },
    staleTime: CACHE_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get current week challenge from challenges repository with better error handling
export const useCurrentWeekChallenge = () => {
  return useQuery({
    queryKey: ["github", "current-week-challenge", GITHUB_ORG],
    queryFn: async () => {
      try {
        // 1. Get quests folder contents
        const questsContents = await fetchFromGitHub<GitHubContent[]>(
          `/repos/${GITHUB_ORG}/challenges/contents/quests`,
        );

        // 2. Filter week files
        const weekChallengeFiles = questsContents.filter(
          (file) => /^week-\d{2}\.md$/i.test(file.name) && file.type === "file",
        );

        if (weekChallengeFiles.length === 0) {
          throw new Error("No week challenge files found in quests folder");
        }

        // 3. Sort by week number (latest first)
        const sortedWeeks = [...weekChallengeFiles].sort((a, b) => {
          const weekA = Number(a.name.match(/week-(\d{2})/i)?.[1] ?? 0);
          const weekB = Number(b.name.match(/week-(\d{2})/i)?.[1] ?? 0);
          return weekB - weekA;
        });

        const currentWeekChallenge = sortedWeeks[0];

        const weekNumber = Number(
          currentWeekChallenge.name.match(/week-(\d{2})/i)?.[1] ?? 1,
        );

        // 4. Fetch file content - use download_url directly
        const downloadUrl = currentWeekChallenge.download_url;
        if (!downloadUrl) {
          throw new Error("No download URL found for challenge file");
        }

        // Fetch the raw content directly
        const response = await fetch(downloadUrl);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch challenge content: ${response.status}`,
          );
        }

        const content = await response.text();

        return {
          title: currentWeekChallenge.name.replace(".md", ""),
          content: content,
          downloadUrl: downloadUrl,
          weekNumber,
          repoUrl: currentWeekChallenge.html_url,
        };
      } catch (error) {
        console.error("Error fetching current week challenge:", error);
        throw error;
      }
    },
    staleTime: CACHE_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get current week number for cycle panel
export const useCurrentWeekNumber = () => {
  return useQuery({
    queryKey: ["github", "current-week-number", GITHUB_ORG],
    queryFn: async () => {
      try {
        // Get the challenges repository
        const repos = await fetchFromGitHub<GitHubRepo[]>(
          `/orgs/${GITHUB_ORG}/repos`,
        );
        const challengesRepo = repos.find(
          (repo) => repo.name.toLowerCase() === "challenges",
        );

        if (!challengesRepo) {
          throw new Error("Challenges repository not found");
        }

        // Get the contents of the quests folder
        const questsContents = await fetchFromGitHub<GitHubContent[]>(
          `/repos/${GITHUB_ORG}/challenges/contents/quests`,
        );

        // Find all week challenge files and get the latest one
        const weekChallengeFiles = questsContents.filter(
          (file) =>
            file.type === "file" && file.name.match(/^week-\d{2}\.md$/i),
        );

        if (weekChallengeFiles.length === 0) {
          throw new Error("No week challenge files found in quests folder");
        }

        // Sort by week number (descending) to get the latest week
        const sortedWeeks = weekChallengeFiles.sort((a, b) => {
          const weekA = parseInt(a.name.match(/week-(\d{2})/i)?.[1] || "0");
          const weekB = parseInt(b.name.match(/week-(\d{2})/i)?.[1] || "0");
          return weekB - weekA; // Descending order
        });

        const currentWeekChallenge = sortedWeeks[0]; // Latest week
        const weekNumber = parseInt(
          currentWeekChallenge.name.match(/week-(\d{2})/i)?.[1] || "1",
        );

        // Get the creation date of the current challenge file
        let createdAt: string | null = null;
        try {
          const commitsResponse = await fetch(
            `${GITHUB_API_URL}/repos/${GITHUB_ORG}/challenges/commits?path=quests/${currentWeekChallenge.name}`,
          );
          if (commitsResponse.ok) {
            const commits = await commitsResponse.json();
            if (commits.length > 0) {
              // Use the last commit's date as the creation date (oldest commit)
              createdAt = commits[commits.length - 1].commit.author.date;
            }
          }
        } catch (error) {
          console.warn(
            `Failed to fetch commit history for ${currentWeekChallenge.name}`,
            error,
          );
        }

        return {
          weekNumber: weekNumber,
          weekName: currentWeekChallenge.name,
          createdAt: createdAt,
        };
      } catch (error) {
        console.error("Error fetching current week number:", error);
        throw error;
      }
    },
    staleTime: CACHE_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get organization leaderboard data
export const useOrganizationLeaderboard = () => {
  return useQuery({
    queryKey: ["github", "leaderboard", GITHUB_ORG],
    queryFn: async () => {
      try {
        // Get all repositories in the organization
        const repos = await fetchFromGitHub<GitHubRepo[]>(
          `/orgs/${GITHUB_ORG}/repos`,
        );

        // Get all contributors across all repositories
        const allContributors: Record<
          string,
          {
            username: string;
            avatar_url: string;
            prsMerged: number;
            prsSubmitted: number;
            issuesClosed: number;
            contributions: number;
            commits: number;
            reposContributed: Set<string>;
          }
        > = {};

        // Get all PRs and issues across all repositories
        for (const repo of repos) {
          try {
            // Get contributors for this repo (includes commit data)
            const contributors = await fetchFromGitHub<GitHubContributor[]>(
              `/repos/${GITHUB_ORG}/${repo.name}/contributors`,
            );

            // Get PRs for this repo
            const prs = await fetchFromGitHub<GitHubPullRequest[]>(
              `/repos/${GITHUB_ORG}/${repo.name}/pulls?state=all`,
            );

            // Get issues for this repo (filter out pull requests)
            const issues = await fetchFromGitHub<GitHubIssue[]>(
              `/repos/${GITHUB_ORG}/${repo.name}/issues?state=all`,
            );

            // Process contributors (includes commit counts)
            for (const contributor of contributors) {
              if (!allContributors[contributor.login]) {
                allContributors[contributor.login] = {
                  username: contributor.login,
                  avatar_url: contributor.avatar_url,
                  prsMerged: 0,
                  prsSubmitted: 0,
                  issuesClosed: 0,
                  contributions: contributor.contributions,
                  commits: contributor.contributions,
                  reposContributed: new Set([repo.name]),
                };
              } else {
                allContributors[contributor.login].contributions +=
                  contributor.contributions;
                allContributors[contributor.login].commits +=
                  contributor.contributions;
                allContributors[contributor.login].reposContributed.add(
                  repo.name,
                );
              }
            }

            // Process PRs
            for (const pr of prs) {
              if (!allContributors[pr.user.login]) {
                allContributors[pr.user.login] = {
                  username: pr.user.login,
                  avatar_url: pr.user.avatar_url,
                  prsMerged: pr.state === "closed" ? 1 : 0,
                  prsSubmitted: 1,
                  issuesClosed: 0,
                  contributions: 0,
                  commits: 0,
                  reposContributed: new Set([repo.name]),
                };
              } else {
                allContributors[pr.user.login].prsSubmitted += 1;
                if (pr.state === "closed") {
                  allContributors[pr.user.login].prsMerged += 1;
                }
              }
            }

            // Process issues (closed issues only, filter out pull requests)
            const realIssues = issues.filter((issue) => !issue.pull_request);
            for (const issue of realIssues) {
              if (issue.state === "closed") {
                if (!allContributors[issue.user.login]) {
                  allContributors[issue.user.login] = {
                    username: issue.user.login,
                    avatar_url: issue.user.avatar_url,
                    prsMerged: 0,
                    prsSubmitted: 0,
                    issuesClosed: 1,
                    contributions: 0,
                    commits: 0,
                    reposContributed: new Set([repo.name]),
                  };
                } else {
                  allContributors[issue.user.login].issuesClosed += 1;
                }
              }
            }
          } catch (error) {
            console.warn(`Failed to fetch data for ${repo.name}:`, error);
            // Continue with other repos
          }
        }

        // Convert to array and sort by merged PRs (descending)
        const leaderboard = Object.values(allContributors)
          .map((contributor) => ({
            ...contributor,
            streak: Math.min(contributor.reposContributed.size * 2, 12),
            topRepo: Array.from(contributor.reposContributed)[0] || "unknown",
          }))
          .sort((a, b) => b.prsMerged - a.prsMerged);

        // Add ranks
        return leaderboard.map((contributor, index) => ({
          rank: index + 1,
          ...contributor,
        }));
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        throw error;
      }
    },
    staleTime: CACHE_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get all challenges from the challenges repository
export const useAllChallenges = () => {
  return useQuery({
    queryKey: ["github", "all-challenges", GITHUB_ORG],
    queryFn: async () => {
      try {
        // 1. Get all repositories in the organization
        const repos = await fetchFromGitHub<GitHubRepo[]>(
          `/orgs/${GITHUB_ORG}/repos`,
        );

        // 2. Find the challenges repository
        const challengesRepo = repos.find(
          (repo) => repo.name.toLowerCase() === "challenges",
        );

        if (!challengesRepo) {
          console.warn("Challenges repository not found");
          return [];
        }

        // 3. Get all challenge files from the quests directory
        const challengeFiles = await fetchFromGitHub<GitHubContent[]>(
          `/repos/${GITHUB_ORG}/challenges/contents/quests`,
        );

        // 4. Filter only markdown files (week challenges)
        const weekChallengeFiles = challengeFiles.filter(
          (file) =>
            file.type === "file" && file.name.match(/^week-\d{2}\.md$/i),
        );

        if (weekChallengeFiles.length === 0) {
          console.warn("No week challenge files found");
          return [];
        }

        // 5. Sort by week number (ascending)
        const sortedChallenges = [...weekChallengeFiles].sort((a, b) => {
          const weekA = Number(a.name.match(/week-(\d{2})/i)?.[1] ?? 0);
          const weekB = Number(b.name.match(/week-(\d{2})/i)?.[1] ?? 0);
          return weekA - weekB;
        });

        // 6. Fetch content and commit history for each challenge
        const challengesWithDetails = await Promise.all(
          sortedChallenges.map(async (challengeFile) => {
            const weekNumber = Number(
              challengeFile.name.match(/week-(\d{2})/i)?.[1] ?? 1,
            );

            // Fetch challenge content
            const downloadUrl = challengeFile.download_url;
            if (!downloadUrl) {
              return null;
            }

            const response = await fetch(downloadUrl);
            if (!response.ok) {
              console.warn(
                `Failed to fetch challenge content for ${challengeFile.name}`,
              );
              return null;
            }

            const content = await response.text();

            // Try to get the file creation date from GitHub commits API
            let createdAt: string | null = null;
            try {
              const commitsResponse = await fetch(
                `${GITHUB_API_URL}/repos/${GITHUB_ORG}/challenges/commits?path=quests/${challengeFile.name}`,
              );
              if (commitsResponse.ok) {
                const commits = await commitsResponse.json();
                if (commits.length > 0) {
                  // Use the last commit's date as the creation date (oldest commit)
                  createdAt = commits[commits.length - 1].commit.author.date;
                }
              }
            } catch (error) {
              console.warn(
                `Failed to fetch commit history for ${challengeFile.name}`,
                error,
              );
            }

            // Try to find the corresponding repository for this challenge
            // This is a heuristic - we look for repos that might match the challenge topic
            const potentialRepo = repos.find((repo) => {
              // Simple matching - could be enhanced with better logic
              const challengeTitleMatch = content
                .toLowerCase()
                .match(/# week \d{2} — ([^\n]+)/i);
              const challengeTitle = challengeTitleMatch?.[1]?.trim() || "";

              return (
                repo.name.toLowerCase().includes("week" + weekNumber) ||
                repo.name
                  .toLowerCase()
                  .includes(challengeTitle.toLowerCase().split(" ")[0]) ||
                repo.description?.toLowerCase().includes("week" + weekNumber)
              );
            });

            return {
              weekNumber,
              title: challengeFile.name.replace(".md", ""),
              fileName: challengeFile.name,
              content,
              downloadUrl,
              htmlUrl: challengeFile.html_url,
              repo: potentialRepo || null,
              createdAt: createdAt,
            };
          }),
        );

        // Filter out null entries and return valid challenges
        return challengesWithDetails.filter(
          (challenge): challenge is NonNullable<typeof challenge> =>
            challenge !== null,
        );
      } catch (error) {
        console.error("Error fetching challenges:", error);
        return [];
      }
    },
    staleTime: CACHE_TIME,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Get organization-wide stats
export const useOrganizationStats = () => {
  const { data: leaderboardData } = useOrganizationLeaderboard();

  return useQuery({
    queryKey: ["github", "org-stats", GITHUB_ORG],
    queryFn: async () => {
      try {
        const now = new Date();
        const oneWeekAgo = new Date(
          now.getTime() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString();

        /* -------------------------------
           1. Fetch challenges (files)
        -------------------------------- */
        let totalChallenges = 0;
        try {
          const challengeFiles = await fetchFromGitHub<GitHubContent[]>(
            `/repos/${GITHUB_ORG}/challenges/contents/quests`,
          );
          totalChallenges = challengeFiles.filter(
            (file) => file.type === "file" && file.name.endsWith(".md"),
          ).length;
        } catch (error) {
          console.warn("Could not fetch challenges:", error);
        }

        /* -------------------------------
           2. Weekly activity (org-wide)
        -------------------------------- */
        const issuesOpenedQuery = `is:issue+org:${GITHUB_ORG}+created:>=${oneWeekAgo}`;
        const prsSubmittedQuery = `is:pr+org:${GITHUB_ORG}+created:>=${oneWeekAgo}`;
        const prsMergedQuery = `is:pr+org:${GITHUB_ORG}+merged:>=${oneWeekAgo}`;

        const [issuesOpenedResult, prsSubmittedResult, prsMergedResult] =
          await Promise.all([
            fetchFromGitHub<{ total_count: number }>(
              `/search/issues?q=${issuesOpenedQuery}`,
            ).catch(() => ({ total_count: 0 })),
            fetchFromGitHub<{
              total_count: number;
              items: GitHubPullRequest[];
            }>(`/search/issues?q=${prsSubmittedQuery}`).catch(() => ({
              total_count: 0,
              items: [],
            })),
            fetchFromGitHub<{ total_count: number }>(
              `/search/issues?q=${prsMergedQuery}`,
            ).catch(() => ({ total_count: 0 })),
          ]);

        /* -------------------------------
           3. Active contributors (weekly)
        -------------------------------- */
        const activeContributorsThisWeek = new Set(
          prsSubmittedResult.items.map((pr) => pr.user.login),
        ).size;

        /* -------------------------------
           4. Aggregates from leaderboard
        -------------------------------- */
        const totalContributors = leaderboardData?.length ?? 0;

        const totalMergedPRs =
          leaderboardData?.reduce((acc, user) => acc + user.prsMerged, 0) ?? 0;

        const totalIssuesResolved =
          leaderboardData?.reduce((acc, user) => acc + user.issuesClosed, 0) ??
          0;

        return {
          totalChallenges,
          totalContributors,
          totalMergedPRs,
          totalIssuesResolved,
          issuesOpenedThisWeek: issuesOpenedResult.total_count,
          prsSubmittedThisWeek: prsSubmittedResult.total_count,
          prsMergedThisWeek: prsMergedResult.total_count,
          activeContributorsThisWeek,
        };
      } catch (error) {
        console.error("Error fetching organization stats:", error);
        throw error;
      }
    },
    staleTime: CACHE_TIME,
    retry: 3,
    enabled: !!leaderboardData,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Type definitions
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubChallenge {
  weekNumber: number;
  title: string;
  fileName: string;
  content: string;
  downloadUrl: string;
  htmlUrl: string;
  repo: GitHubRepo | null;
  createdAt: string | null;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  labels: Array<{
    id: number;
    name: string;
    color: string;
    description: string | null;
  }>;
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  html_url: string;
  repository_url: string;
  body: string | null;
  pull_request?: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
  };
}

export interface GitHubPullRequest {
  id: number;
  number: number;
  title: string;
  state: "open" | "closed";
  user: GitHubUser;
  created_at: string;
  updated_at: string;
  html_url: string;
  merged_at: string | null;
  head: {
    ref: string;
    sha: string;
    repo: {
      full_name: string;
    };
  };
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  type: string;
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface GitHubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}
