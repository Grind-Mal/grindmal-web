import { GitPullRequest, Check, Clock, GitPullRequestIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAllOrganizationPullRequests } from "@/lib/github-api";
import { transformGitHubPR } from "@/lib/github-utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type PRStatus = "open" | "merged" | "pending";

interface PullRequest {
  id: number;
  title: string;
  author: {
    name: string;
    avatar: string;
    initials: string;
  };
  status: PRStatus;
  url: string;
}

const statusConfig: Record<
  PRStatus,
  { icon: typeof Check; color: string; label: string }
> = {
  merged: { icon: Check, color: "text-status-merged", label: "Merged" },
  open: { icon: GitPullRequest, color: "text-status-open", label: "Open" },
  pending: {
    icon: Clock,
    color: "text-status-in-progress",
    label: "Pending Review",
  },
};

const PRActivity = () => {
  const {
    data: githubPRs,
    isLoading,
    error,
  } = useAllOrganizationPullRequests();

  // Transform GitHub PRs to our component format
  const prs: PullRequest[] = githubPRs
    ? githubPRs
        .slice(0, 4) // Limit to 4 PRs for the dashboard
        .map(transformGitHubPR)
    : [];

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            PR Activity
          </h2>
          <div className="flex -space-x-2">
            {Array(4)
              .fill(0)
              .map((_, index) => (
                <Avatar
                  key={index}
                  className="h-7 w-7 border-2 border-card animate-pulse bg-muted"
                >
                  <AvatarFallback className="bg-muted text-xs font-mono">
                    GH
                  </AvatarFallback>
                </Avatar>
              ))}
          </div>
        </div>

        <div className="space-y-3">
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-md border border-border bg-background p-3 animate-pulse"
              >
                <div className="h-4 w-4 rounded-full bg-muted"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      #---
                    </span>
                    <span className="text-xs font-medium text-muted-foreground">
                      Loading
                    </span>
                  </div>
                  <div className="h-4 w-3/4 rounded bg-muted mt-0.5"></div>
                </div>
                <Avatar className="h-6 w-6 animate-pulse bg-muted">
                  <AvatarFallback className="bg-muted text-xs font-mono">
                    GH
                  </AvatarFallback>
                </Avatar>
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
            PR Activity
          </h2>
          <span className="font-mono text-xs text-destructive">
            Error loading PRs
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Failed to fetch PR activity from GitHub. Please try again later.
        </div>
      </div>
    );
  }

  // No PRs state
  if (prs.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            PR Activity
          </h2>
          <GitPullRequestIcon className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-muted/50 p-4 mb-4">
            <GitPullRequestIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No Pull Requests Yet
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Be the first to submit a pull request! Contribute to any repository
            to see activity here.
          </p>

          <div className="space-y-3 w-full">
            <Link to="/challenges" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                View Current Challenge
              </Button>
            </Link>

            <div className="text-xs text-muted-foreground">
              <p className="mb-1">Ready to contribute?</p>
              <ol className="list-decimal pl-4 space-y-1 text-left">
                <li>Fork a repository from the organization</li>
                <li>Make your changes and commit them</li>
                <li>Submit a pull request</li>
              </ol>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Quick Start</span>
            <Link to="/repositories" className="text-primary hover:underline">
              Browse Repositories →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 card-glow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          PR Activity
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono">
            {prs.length} {prs.length === 1 ? "PR" : "PRs"}
          </span>
          <div className="flex -space-x-2">
            {prs.slice(0, 4).map((pr) => (
              <Tooltip key={pr.id}>
                <TooltipTrigger asChild>
                  <Avatar className="h-7 w-7 border-2 border-card cursor-pointer hover:z-10 transition-transform hover:scale-110">
                    <AvatarImage src={pr.author.avatar} alt={pr.author.name} />
                    <AvatarFallback className="bg-secondary text-xs font-mono">
                      {pr.author.initials}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-popover border-border">
                  <p className="font-mono text-sm">{pr.author.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {prs.map((pr) => {
          const StatusIcon = statusConfig[pr.status].icon;
          return (
            <Tooltip key={pr.id}>
              <TooltipTrigger asChild>
                <a
                  href={pr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-md border border-border bg-background p-3 transition-all hover:border-primary/30 hover:bg-accent"
                >
                  <StatusIcon
                    className={`h-4 w-4 ${statusConfig[pr.status].color}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        #{pr.id}
                      </span>
                      <span
                        className={`text-xs font-medium ${statusConfig[pr.status].color}`}
                      >
                        {statusConfig[pr.status].label}
                      </span>
                    </div>
                    <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors mt-0.5">
                      {pr.title}
                    </p>
                  </div>
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={pr.author.avatar} alt={pr.author.name} />
                    <AvatarFallback className="bg-muted text-xs font-mono">
                      {pr.author.initials}
                    </AvatarFallback>
                  </Avatar>
                </a>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-popover border-border">
                <p className="font-mono text-sm">{pr.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  by @{pr.author.name}
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Show "View All" link if there are more PRs */}
        {githubPRs && githubPRs.length > 4 && (
          <div className="pt-3">
            <a
              href={`https://github.com/orgs/${import.meta.env.VITE_GITHUB_ORGANIZATION}/pulls`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              View all {githubPRs.length} pull requests
              <GitPullRequestIcon className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default PRActivity;
