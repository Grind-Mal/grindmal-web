import { GitHubIssue, GitHubPullRequest, GitHubRepo } from "./github-api";

// Transform GitHub issue to component format
// Note: GitHub API /issues endpoint returns both issues and PRs
// We need to filter out PRs (they have pull_request property)

const determineDifficultyFromBody = (body: string | null): string | null => {
  if (!body) {
    return null;
  }
  const match = body.match(/### Difficulty\n\n(\w+)/);
  if (match && match[1]) {
    return match[1].toLowerCase();
  }
  return null;
};

export const transformGitHubIssue = (issue: any): any => {
  // Skip if this is actually a pull request
  if (issue.pull_request) {
    return null;
  }

  const difficultyFromBody = determineDifficultyFromBody(issue.body);

  return {
    id: issue.number,
    title: issue.title,
    status: mapGitHubStateToStatus(issue.state),
    labels: issue.labels.map((label: any) => label.name),
    url: issue.html_url,
    repo: extractRepoNameFromUrl(issue.repository_url),
    createdAt: formatDateDistance(issue.created_at),
    difficulty: difficultyFromBody || determineDifficultyFromLabels(issue.labels),
  };
};


// Transform GitHub PR to component format
export const transformGitHubPR = (pr: GitHubPullRequest): any => {
  return {
    id: pr.number,
    title: pr.title,
    author: {
      name: pr.user.login,
      avatar: pr.user.avatar_url,
      initials: getInitialsFromUsername(pr.user.login),
    },
    status: mapPRStateToStatus(pr.state),
    url: pr.html_url,
  };
};

// Transform GitHub repo to component format
export const transformGitHubRepo = (repo: GitHubRepo): any => {
  return {
    title: repo.name,
    description: repo.description || "No description available",
    readme: generateReadmePreview(repo),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    repoUrl: repo.html_url,
  };
};

// Helper functions
const mapGitHubStateToStatus = (state: string): string => {
  const stateMap: Record<string, string> = {
    open: "open",
    closed: "merged", // In GitHub API, closed PRs can be merged
  };
  return stateMap[state] || "open";
};

const mapPRStateToStatus = (state: string): string => {
  const stateMap: Record<string, string> = {
    open: "open",
    closed: "merged",
    merged: "merged",
  };
  return stateMap[state] || "open";
};

const extractRepoNameFromUrl = (url: string): string => {
  const parts = url.split("/");
  return parts[parts.length - 1];
};

const formatDateDistance = (dateString: string): string => {
  const now = new Date();
  const created = new Date(dateString);
  const diffInMs = now.getTime() - created.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "yesterday";
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 14) return "1 week ago";
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 60) return "1 month ago";
  return `${Math.floor(diffInDays / 30)} months ago`;
};

const determineDifficultyFromLabels = (
  labels: Array<{ name: string }>,
): string => {
  const labelNames = labels.map((label) => label.name.toLowerCase());

  if (labelNames.some((label) => label.includes("advanced"))) return "advanced";
  if (labelNames.some((label) => label.includes("intermediate")))
    return "intermediate";
  if (
    labelNames.some(
      (label) => label.includes("beginner") || label.includes("good first"),
    )
  )
    return "beginner";

  return "intermediate"; // default
};

const getInitialsFromUsername = (username: string): string => {
  if (!username) return "GH";

  const parts = username.split(/[-_]/);
  if (parts.length > 1) {
    return parts.map((part) => part[0].toUpperCase()).join("");
  }

  return username.slice(0, 2).toUpperCase();
};

const generateReadmePreview = (repo: GitHubRepo): string => {
  if (!repo.description) return "No README available";

  return `## ${repo.name}

${repo.description}

### Installation

\[TODO: Add installation instructions\]

### Features

- Feature 1
- Feature 2
- Feature 3`;
};

// Parse GitHub challenge content and extract metadata
export const parseChallengeContent = (
  challenge: {
    weekNumber: number;
    title: string;
    content: string;
    repo: GitHubRepo | null;
    createdAt: string | null;
  },
  currentWeekNumber?: number,
): any => {
  const lines = challenge.content.split("\n");

  let fullTitle = challenge.title;
  let description = "";
  const beginnerTasks: string[] = [];
  const intermediateTasks: string[] = [];
  const advancedTasks: string[] = [];
  const tags: string[] = [];

  let currentSection = "none";

  for (const line of lines) {
    // Extract full title from first heading
    if (line.startsWith("# ") && !fullTitle.includes("—")) {
      fullTitle = line.replace("# ", "").trim();
    }

    // Extract tags/keywords from title
    if (fullTitle.includes("—")) {
      const titleParts = fullTitle.split("—");
      if (titleParts.length > 1) {
        const emojiAndTitle = titleParts[1].trim();
        // Extract emoji and main title
        const emojiMatch = emojiAndTitle.match(/^(\p{Emoji}+)\s+(.+)$/u);
        if (emojiMatch) {
          fullTitle = `Week ${challenge.weekNumber} — ${emojiMatch[2].trim()}`;
          // Add emoji as first tag
          tags.push(emojiMatch[1].trim());
        } else {
          // If no emoji match, just use the title part
          fullTitle = `Week ${challenge.weekNumber} — ${titleParts[1].trim()}`;
        }
      }
    }

    // Section detection
    if (line.startsWith("## Beginner Task")) {
      currentSection = "beginner";
    } else if (line.startsWith("## Intermediate Task")) {
      currentSection = "intermediate";
    } else if (line.startsWith("## Advanced Task")) {
      currentSection = "advanced";
    } else if (line.startsWith("## Submission")) {
      currentSection = "submission";
    } else if (line.startsWith("---")) {
      currentSection = "none";
    } else if (
      currentSection === "none" &&
      line.trim() &&
      !line.startsWith("#")
    ) {
      if (description.length > 0) description += " ";
      description += line.trim();
    } else if (currentSection === "beginner" && line.trim().startsWith("-")) {
      beginnerTasks.push(line.trim().replace(/^- /, ""));
    } else if (
      currentSection === "intermediate" &&
      line.trim().startsWith("-")
    ) {
      intermediateTasks.push(line.trim().replace(/^- /, ""));
    } else if (currentSection === "advanced" && line.trim().startsWith("-")) {
      advancedTasks.push(line.trim().replace(/^- /, ""));
    }
  }

  // Extract additional tags from description
  // const descriptionLower = description.toLowerCase();
  // if (descriptionLower.includes("cli")) tags.push("CLI");
  // if (descriptionLower.includes("language-agnostic")) tags.push("Any Language");
  // if (descriptionLower.includes("rust")) tags.push("Rust");
  // if (descriptionLower.includes("go")) tags.push("Go");
  // if (descriptionLower.includes("python")) tags.push("Python");
  // if (descriptionLower.includes("javascript")) tags.push("JavaScript");
  // if (descriptionLower.includes("typescript")) tags.push("TypeScript");
  // if (descriptionLower.includes("node")) tags.push("Node.js");
  // if (descriptionLower.includes("api")) tags.push("API");
  // if (descriptionLower.includes("git")) tags.push("Git");
  // if (descriptionLower.includes("devops")) tags.push("DevOps");
  // if (descriptionLower.includes("testing")) tags.push("Testing");
  // if (descriptionLower.includes("wasm")) tags.push("WASM");
  // if (descriptionLower.includes("parser")) tags.push("Parser");
  // if (descriptionLower.includes("validation")) tags.push("Validation");
  // if (descriptionLower.includes("dx")) tags.push("DX");
  // if (descriptionLower.includes("productivity")) tags.push("Productivity");

  // Remove duplicates and limit to 3 tags
  const uniqueTags = [...new Set(tags)].slice(0, 3);

  // Determine status based on the actual current challenge week
  // If currentWeekNumber is provided, use it (from useCurrentWeekNumber)
  // Otherwise fall back to calendar week calculation
  const currentWeek =
    currentWeekNumber ||
    Math.floor(
      (new Date().getTime() -
        new Date(new Date().getFullYear(), 0, 1).getTime()) /
        (7 * 24 * 60 * 60 * 1000),
    ) + 1;

  let status: "active" | "completed" | "upcoming" = "completed";

  if (challenge.weekNumber > currentWeek) {
    status = "upcoming";
  } else if (challenge.weekNumber === currentWeek) {
    status = "active";
  }

  // Generate dates based on the createdAt date from the commit history
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (challenge.createdAt) {
    startDate = new Date(challenge.createdAt);
    startDate.setUTCHours(0, 0, 0, 0); // Set to beginning of the day in UTC
    endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
  }

  return {
    id: challenge.weekNumber,
    week: challenge.weekNumber,
    title: fullTitle.replace("Week " + challenge.weekNumber + " — ", ""),
    fullTitle,
    description: description || "No description available",
    status,
    startDate: startDate
      ? startDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })
      : "N/A",
    endDate: endDate
      ? endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        })
      : "N/A",
    stars: challenge.repo?.stargazers_count || 0,
    forks: challenge.repo?.forks_count || 0,
    contributors: challenge.repo?.open_issues_count || 0, // Simplified
    mergedPRs: 0, // Would need actual PR data
    repoUrl:
      challenge.repo?.html_url || "https://github.com/Grind-Mal/challenges",
    tags: uniqueTags,
    content: challenge.content,
    downloadUrl: challenge.downloadUrl,
  };
};

// Helper function to get current week number (simplified)
const getCurrentWeekNumber = (): number => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  // Thursday in current week decides the year
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
  // January 4 is always in week 1
  const week1 = new Date(date.getFullYear(), 0, 4);
  // Adjust to Thursday in week 1 and count weeks
  return (
    1 +
    Math.round(
      ((date.getTime() - week1.getTime()) / 86400000 +
        3 +
        ((week1.getDay() + 6) % 7)) /
        7,
    )
  );
};
