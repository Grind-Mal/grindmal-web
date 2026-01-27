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

type IssueStatus = "open" | "in-progress" | "closed";
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

const allIssues: Issue[] = [
  {
    id: 42,
    title: "Add --quiet flag to suppress non-essential output",
    repo: "grindmal-cli",
    status: "open",
    difficulty: "beginner",
    labels: ["good first issue", "enhancement"],
    url: "https://github.com/grindmal/grindmal-cli/issues/42",
    createdAt: "2 days ago",
  },
  {
    id: 38,
    title: "Fix timezone handling in session timestamps",
    repo: "grindmal-cli",
    status: "in-progress",
    difficulty: "intermediate",
    labels: ["bug", "help wanted"],
    url: "https://github.com/grindmal/grindmal-cli/issues/38",
    createdAt: "4 days ago",
  },
  {
    id: 35,
    title: "Support custom Pomodoro intervals via config",
    repo: "grindmal-cli",
    status: "open",
    difficulty: "beginner",
    labels: ["enhancement"],
    url: "https://github.com/grindmal/grindmal-cli/issues/35",
    createdAt: "5 days ago",
  },
  {
    id: 31,
    title: "Add JSON output format for scripting",
    repo: "grindmal-cli",
    status: "open",
    difficulty: "beginner",
    labels: ["good first issue"],
    url: "https://github.com/grindmal/grindmal-cli/issues/31",
    createdAt: "1 week ago",
  },
  {
    id: 156,
    title: "Implement streaming parser for large files",
    repo: "rustmark",
    status: "open",
    difficulty: "advanced",
    labels: ["performance", "help wanted"],
    url: "https://github.com/grindmal/rustmark/issues/156",
    createdAt: "3 days ago",
  },
  {
    id: 142,
    title: "Add syntax highlighting for code blocks",
    repo: "rustmark",
    status: "in-progress",
    difficulty: "intermediate",
    labels: ["enhancement"],
    url: "https://github.com/grindmal/rustmark/issues/142",
    createdAt: "6 days ago",
  },
  {
    id: 89,
    title: "Support GraphQL schema mocking",
    repo: "api-mock-server",
    status: "open",
    difficulty: "advanced",
    labels: ["feature request"],
    url: "https://github.com/grindmal/api-mock-server/issues/89",
    createdAt: "1 week ago",
  },
  {
    id: 67,
    title: "Add request logging with timestamps",
    repo: "api-mock-server",
    status: "open",
    difficulty: "beginner",
    labels: ["good first issue", "enhancement"],
    url: "https://github.com/grindmal/api-mock-server/issues/67",
    createdAt: "2 weeks ago",
  },
  {
    id: 234,
    title: "Interactive mode for branch selection",
    repo: "git-cleanup",
    status: "closed",
    difficulty: "intermediate",
    labels: ["enhancement"],
    url: "https://github.com/grindmal/git-cleanup/issues/234",
    createdAt: "3 weeks ago",
  },
  {
    id: 221,
    title: "Add support for worktrees",
    repo: "git-cleanup",
    status: "open",
    difficulty: "advanced",
    labels: ["help wanted"],
    url: "https://github.com/grindmal/git-cleanup/issues/221",
    createdAt: "3 weeks ago",
  },
];

const statusColors: Record<IssueStatus, string> = {
  open: "text-status-open",
  "in-progress": "text-status-in-progress",
  closed: "text-muted-foreground",
};

const statusLabels: Record<IssueStatus, string> = {
  open: "Open",
  "in-progress": "In Progress",
  closed: "Closed",
};

const difficultyColors: Record<IssueDifficulty, string> = {
  beginner: "bg-status-merged/20 text-status-merged border-status-merged/30",
  intermediate: "bg-status-in-progress/20 text-status-in-progress border-status-in-progress/30",
  advanced: "bg-destructive/20 text-destructive border-destructive/30",
};

const Issues = () => {
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [difficultyFilter, setDifficultyFilter] = useState<IssueDifficulty | "all">("all");

  const filteredIssues = allIssues.filter((issue) => {
    if (statusFilter !== "all" && issue.status !== statusFilter) return false;
    if (difficultyFilter !== "all" && issue.difficulty !== difficultyFilter) return false;
    return true;
  });

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
          
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground mr-2">Status:</span>
            {(["all", "open", "in-progress", "closed"] as const).map((status) => (
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
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground mr-2">Difficulty:</span>
            {(["all", "beginner", "intermediate", "advanced"] as const).map((diff) => (
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
            ))}
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          Showing <span className="font-mono text-foreground">{filteredIssues.length}</span> issues
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
              <Circle className={`h-4 w-4 mt-1 shrink-0 ${statusColors[issue.status]}`} />
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs text-primary">{issue.repo}</span>
                  <span className="font-mono text-xs text-muted-foreground">#{issue.id}</span>
                  <span className={`text-xs font-medium ${statusColors[issue.status]}`}>
                    {statusLabels[issue.status]}
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${difficultyColors[issue.difficulty]}`}>
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
                  <span className="text-xs text-muted-foreground ml-auto">{issue.createdAt}</span>
                </div>
              </div>

              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </a>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No issues match your filters.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Issues;
