import { GitPullRequest, Check, Clock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

const prs: PullRequest[] = [
  {
    id: 56,
    title: "feat: add --quiet flag implementation",
    author: { name: "alexdev", avatar: "", initials: "AD" },
    status: "merged",
    url: "https://github.com/grindmal/grindmal-cli/pull/56",
  },
  {
    id: 54,
    title: "fix: correct timezone offset calculation",
    author: { name: "sarah_codes", avatar: "", initials: "SC" },
    status: "pending",
    url: "https://github.com/grindmal/grindmal-cli/pull/54",
  },
  {
    id: 52,
    title: "docs: update README with new examples",
    author: { name: "mike_rust", avatar: "", initials: "MR" },
    status: "merged",
    url: "https://github.com/grindmal/grindmal-cli/pull/52",
  },
  {
    id: 49,
    title: "feat: add JSON output formatter",
    author: { name: "devina", avatar: "", initials: "DV" },
    status: "open",
    url: "https://github.com/grindmal/grindmal-cli/pull/49",
  },
];

const statusConfig: Record<PRStatus, { icon: typeof Check; color: string; label: string }> = {
  merged: { icon: Check, color: "text-status-merged", label: "Merged" },
  open: { icon: GitPullRequest, color: "text-status-open", label: "Open" },
  pending: { icon: Clock, color: "text-status-in-progress", label: "Pending Review" },
};

const PRActivity = () => {
  return (
    <div className="rounded-lg border border-border bg-card p-5 card-glow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          PR Activity
        </h2>
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
                  <StatusIcon className={`h-4 w-4 ${statusConfig[pr.status].color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">#{pr.id}</span>
                      <span className={`text-xs font-medium ${statusConfig[pr.status].color}`}>
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
                <p className="text-xs text-muted-foreground mt-1">by @{pr.author.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
};

export default PRActivity;
