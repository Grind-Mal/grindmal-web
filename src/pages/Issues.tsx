import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Circle, ExternalLink, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAllOrganizationIssues } from "@/lib/github-api";
import { transformGitHubIssue } from "@/lib/github-utils";

type IssueStatus = "open" | "in-progress" | "merged";
type IssueDifficulty = "beginner" | "intermediate" | "advanced";

interface Issue {
  id: number;
  title: string;
  repo: string;
  status: IssueStatus;
  difficulty: IssueDifficulty;
  labels: string[];
  url: string;
  createdAt: string;
}

const statusColors: Record<IssueStatus, string> = {
  open: "text-status-open",
  "in-progress": "text-status-in-progress",
  merged: "text-muted-foreground",
};

const statusLabels: Record<IssueStatus, string> = {
  open: "Open",
  "in-progress": "In Progress",
  merged: "Merged",
};

const difficultyColors: Record<IssueDifficulty, string> = {
  beginner: "bg-status-merged/20 text-status-merged border-status-merged/30",
  intermediate:
    "bg-status-in-progress/20 text-status-in-progress border-status-in-progress/30",
  advanced: "bg-destructive/20 text-destructive border-destructive/30",
};

const Issues = () => {
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<
    IssueDifficulty | "all"
  >("all");

  const { data: githubIssues, isLoading, error } = useAllOrganizationIssues();

  // Transform GitHub issues to our component format
  // Filter out null values (which are PRs that we don't want to show)
  const allIssues: Issue[] = githubIssues
    ? githubIssues
        .map(transformGitHubIssue)
        .filter((issue): issue is Issue => issue !== null)
    : [];

  const filteredIssues = allIssues.filter((issue) => {
    if (statusFilter !== "all" && issue.status !== statusFilter) return false;
    if (difficultyFilter !== "all" && issue.difficulty !== difficultyFilter)
      return false;
    return true;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container py-8 flex-1">
          <div className="mb-8">
            <h1 className="font-mono text-3xl font-bold text-foreground mb-2">
              Open <span className="text-gradient">Issues</span>
            </h1>
            <p className="text-muted-foreground">
              Loading issues from GitHub...
            </p>
          </div>

          <div className="space-y-4">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 animate-pulse"
                >
                  <div className="h-4 w-4 mt-1 shrink-0 rounded-full bg-muted"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="font-mono text-xs text-primary bg-muted rounded px-2 py-0.5 w-16"></span>
                      <span className="font-mono text-xs text-muted-foreground bg-muted rounded px-2 py-0.5 w-8"></span>
                      <span className="text-xs font-medium text-muted-foreground bg-muted rounded px-2 py-0.5 w-12"></span>
                      <span className="rounded-full border px-2 py-0.5 text-xs capitalize bg-muted text-transparent w-16"></span>
                    </div>
                    <div className="h-4 w-3/4 rounded bg-muted mb-2"></div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-transparent w-12"></span>
                      <span className="text-xs text-muted-foreground ml-auto bg-muted rounded px-2 py-0.5 w-16"></span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container py-8 flex-1">
          <div className="mb-8">
            <h1 className="font-mono text-3xl font-bold text-foreground mb-2">
              Open <span className="text-gradient">Issues</span>
            </h1>
            <p className="text-muted-foreground">
              Error loading issues from GitHub.
            </p>
          </div>

          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 mb-4">
            <p className="text-sm text-destructive mb-2">
              Failed to fetch issues from GitHub API.
            </p>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Unknown error occurred"}
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90"
              size="sm"
            >
              Retry
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-foreground mb-2">
            Open <span className="text-gradient">Issues</span>
          </h1>
          <p className="text-muted-foreground">
            Find an issue. Claim it. Ship a PR. Simple.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6 p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filter:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">Status:</span>
            {(["all", "open", "in-progress", "merged"] as const).map(
              (status) => (
                <Button
                  key={status}
                  variant="ghost"
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={`h-7 px-3 text-xs ${
                    statusFilter === status
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {status === "all" ? "All" : statusLabels[status]}
                </Button>
              ),
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">
              Difficulty:
            </span>
            {(["all", "beginner", "intermediate", "advanced"] as const).map(
              (diff) => (
                <Button
                  key={diff}
                  variant="ghost"
                  size="sm"
                  onClick={() => setDifficultyFilter(diff)}
                  className={`h-7 px-3 text-xs capitalize ${
                    difficultyFilter === diff
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {diff}
                </Button>
              ),
            )}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing{" "}
          <span className="font-mono text-foreground">
            {filteredIssues.length}
          </span>{" "}
          issues
        </p>

        {/* Issues List */}
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <a
              key={`${issue.repo}-${issue.id}`}
              href={issue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:bg-accent card-glow"
            >
              <Circle
                className={`h-4 w-4 mt-1 shrink-0 ${statusColors[issue.status]}`}
              />

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs text-primary">
                    {issue.repo}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    #{issue.id}
                  </span>
                  <span
                    className={`text-xs font-medium ${statusColors[issue.status]}`}
                  >
                    {statusLabels[issue.status]}
                  </span>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-xs capitalize ${difficultyColors[issue.difficulty]}`}
                  >
                    {issue.difficulty}
                  </span>
                </div>

                <p className="text-sm text-foreground group-hover:text-primary transition-colors mb-2">
                  {issue.title}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {issue.labels.map((label) => (
                    <span
                      key={label}
                      className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {label}
                    </span>
                  ))}
                  <span className="text-xs text-muted-foreground ml-auto">
                    {issue.createdAt}
                  </span>
                </div>
              </div>

              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No issues match your filters.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Issues;
