import {
  Circle,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  GitMerge,
} from "lucide-react";
import { useAllOrganizationIssues } from "@/lib/github-api";
import { transformGitHubIssue } from "@/lib/github-utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type IssueStatus = "open" | "in-progress" | "closed" | "merged";

interface Issue {
  id: number;
  title: string;
  status: IssueStatus | null;
  labels: string[];
  url: string | null;
}

const statusConfig: Record<
  IssueStatus,
  {
    icon: typeof Circle;
    color: string;
    label: string;
    bgColor: string;
  }
> = {
  open: {
    icon: Circle,
    color: "text-status-open",
    label: "Open",
    bgColor: "bg-status-open/10",
  },
  "in-progress": {
    icon: AlertCircle,
    color: "text-status-in-progress",
    label: "In Progress",
    bgColor: "bg-status-in-progress/10",
  },
  closed: {
    icon: CheckCircle,
    color: "text-status-merged",
    label: "Closed",
    bgColor: "bg-status-merged/10",
  },
  merged: {
    icon: GitMerge,
    color: "text-status-merged",
    label: "Merged",
    bgColor: "bg-status-merged/10",
  },
};

const OpenIssues = () => {
  const { data: githubIssues, isLoading, error } = useAllOrganizationIssues();

  // Transform GitHub issues to our component format
  const issues: Issue[] = githubIssues
    ? githubIssues
        // Show both open and closed issues, but filter out pull requests
        .filter((issue) => issue && !issue.pull_request)
        .map(transformGitHubIssue)
        .filter(
          (issue): issue is Issue => issue !== null && issue !== undefined,
        )
        .slice(0, 6) // Show more issues since we include closed ones
    : [];

  // Count by status for stats
  const stats = {
    open: issues.filter((issue) => issue.status === "open").length,
    inProgress: issues.filter((issue) => issue.status === "in-progress").length,
    closed: issues.filter(
      (issue) => issue.status === "closed" || issue.status === "merged",
    ).length,
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Recent Issues
          </h2>
          <span className="font-mono text-xs text-muted-foreground">
            Loading...
          </span>
        </div>
        <div className="space-y-3">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-md border border-border bg-background p-3 animate-pulse"
              >
                <div className="h-4 w-4 mt-0.5 rounded-full bg-muted"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">
                      #---
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      Loading
                    </span>
                  </div>
                  <div className="h-4 w-3/4 rounded bg-muted mb-2"></div>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-transparent">
                      loading
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Recent Issues
          </h2>
          <span className="font-mono text-xs text-destructive">
            Error loading issues
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Failed to fetch issues from GitHub. Please try again later.
        </div>
      </div>
    );
  }

  // No issues state
  if (issues.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Recent Issues
          </h2>
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-muted/50 p-4 mb-4">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Issues Yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            All issues are resolved or no issues have been created yet. Be the
            first to report a bug or suggest an improvement!
          </p>

          <div className="space-y-3 w-full">
            <Link to="/repositories" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Browse Repositories
              </Button>
            </Link>

            <div className="text-xs text-muted-foreground">
              <p className="mb-1">How to contribute with issues:</p>
              <ol className="list-decimal pl-4 space-y-1 text-left">
                <li>Find a repository with issues enabled</li>
                <li>Click on the "Issues" tab</li>
                <li>Create a new issue with clear details</li>
                <li>Add appropriate labels (bug, feature, enhancement)</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Good Issue Practices</span>
            <a
              href="https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1"
            >
              GitHub Guide →
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 card-glow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Recent Issues
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-status-open"></div>
            <span className="text-xs font-mono">{stats.open}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-status-in-progress"></div>
            <span className="text-xs font-mono">{stats.inProgress}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-status-merged"></div>
            <span className="text-xs font-mono">{stats.closed}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {issues.map((issue) => {
          const StatusIcon = issue.status
            ? statusConfig[issue.status].icon
            : Circle;
          const statusColor = issue.status
            ? statusConfig[issue.status].color
            : "text-muted-foreground";
          const statusLabel = issue.status
            ? statusConfig[issue.status].label
            : "Unknown";
          const bgColor = issue.status
            ? statusConfig[issue.status].bgColor
            : "bg-muted/10";

          const IssueWrapper = issue.url ? "a" : "div";
          const wrapperProps = issue.url
            ? {
                href: issue.url,
                target: "_blank" as const,
                rel: "noopener noreferrer",
              }
            : {};

          return (
            <IssueWrapper
              key={issue.id}
              {...wrapperProps}
              className={`group flex items-start gap-3 rounded-md border border-border bg-background p-3 transition-all hover:border-primary/30 hover:bg-accent ${
                issue.url ? "cursor-pointer" : ""
              }`}
            >
              <div className={`p-1 rounded-full ${bgColor} mt-0.5`}>
                <StatusIcon className={`h-3 w-3 ${statusColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-muted-foreground">
                    #{issue.id}
                  </span>
                  {issue.status && (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${bgColor} ${statusColor}`}
                    >
                      {statusLabel}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {issue.title}
                </p>
                {issue.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {issue.labels.slice(0, 2).map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground truncate max-w-[100px]"
                      >
                        {label}
                      </span>
                    ))}
                    {issue.labels.length > 2 && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                        +{issue.labels.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
              {issue.url && (
                <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </IssueWrapper>
          );
        })}

        {/* Show "View All" link if there are more issues */}
        {githubIssues &&
          githubIssues.filter((issue) => !issue.pull_request).length > 6 && (
            <div className="pt-3">
              <a
                href={`https://github.com/orgs/${import.meta.env.VITE_GITHUB_ORGANIZATION}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                View all{" "}
                {githubIssues.filter((issue) => !issue.pull_request).length}{" "}
                issues
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
      </div>
    </div>
  );
};

export default OpenIssues;
