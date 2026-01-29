import { CircleDot, GitPullRequest, GitMerge, Users } from "lucide-react";
import { useOrganizationStats } from "@/lib/github-api";

interface StatItem {
  label: string;
  value: number;
  icon: typeof CircleDot;
  color: string;
}

const CycleScoreboard = () => {
  const { data: orgStats, isLoading } = useOrganizationStats();

  const stats: StatItem[] = [
    {
      label: "Issues Opened",
      value: isLoading ? 0 : orgStats?.issuesOpenedThisWeek || 0,
      icon: CircleDot,
      color: "text-status-open",
    },
    {
      label: "PRs Submitted",
      value: isLoading ? 0 : orgStats?.prsSubmittedThisWeek || 0,
      icon: GitPullRequest,
      color: "text-status-in-progress",
    },
    {
      label: "PRs Merged",
      value: isLoading ? 0 : orgStats?.prsMergedThisWeek || 0,
      icon: GitMerge,
      color: "text-status-merged",
    },
    {
      label: "Active Contributors",
      value: isLoading ? 0 : orgStats?.activeContributorsThisWeek || 0,
      icon: Users,
      color: "text-primary",
    },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-5 card-glow">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
        Cycle Scoreboard
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center justify-center rounded-md bg-background border border-border p-4 text-center"
          >
            <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
            <span className="font-mono text-2xl font-bold text-foreground">
              {isLoading ? "..." : stat.value}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CycleScoreboard;
