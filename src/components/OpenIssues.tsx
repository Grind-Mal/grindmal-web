import { Circle, ExternalLink } from "lucide-react";

type IssueStatus = "open" | "in-progress" | "merged";

interface Issue {
  id: number;
  title: string;
  status: IssueStatus;
  labels: string[];
  url: string;
}

const issues: Issue[] = [
  {
    id: 42,
    title: "Add --quiet flag to suppress non-essential output",
    status: "open",
    labels: ["good first issue", "enhancement"],
    url: "https://github.com/grindmal/grindmal-cli/issues/42",
  },
  {
    id: 38,
    title: "Fix timezone handling in session timestamps",
    status: "in-progress",
    labels: ["bug", "help wanted"],
    url: "https://github.com/grindmal/grindmal-cli/issues/38",
  },
  {
    id: 35,
    title: "Support custom Pomodoro intervals via config",
    status: "open",
    labels: ["enhancement"],
    url: "https://github.com/grindmal/grindmal-cli/issues/35",
  },
  {
    id: 31,
    title: "Add JSON output format for scripting",
    status: "open",
    labels: ["good first issue"],
    url: "https://github.com/grindmal/grindmal-cli/issues/31",
  },
];

const statusColors: Record<IssueStatus, string> = {
  open: "text-status-open",
  "in-progress": "text-status-in-progress",
  merged: "text-status-merged",
};

const statusLabels: Record<IssueStatus, string> = {
  open: "Open",
  "in-progress": "In Progress",
  merged: "Merged",
};

const OpenIssues = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-5 card-glow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Open Issues
        </h2>
        <span className="font-mono text-xs text-muted-foreground">{issues.length} available</span>
      </div>

      <div className="space-y-3">
        {issues.map((issue) => (
          <a
            key={issue.id}
            href={issue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-3 rounded-md border border-border bg-background p-3 transition-all hover:border-primary/30 hover:bg-accent"
          >
            <Circle className={`h-4 w-4 mt-0.5 ${statusColors[issue.status]}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs text-muted-foreground">#{issue.id}</span>
                <span className={`text-xs font-medium ${statusColors[issue.status]}`}>
                  {statusLabels[issue.status]}
                </span>
              </div>
              <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
                {issue.title}
              </p>
              <div className="flex gap-2 mt-2">
                {issue.labels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default OpenIssues;
