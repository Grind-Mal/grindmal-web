import { Calendar, Clock } from "lucide-react";
import { useCurrentWeekNumber } from "@/lib/github-api";

const CyclePanel = () => {
  const { data: weekData, isLoading, error } = useCurrentWeekNumber();
  
  // Calculate cycle dates based on current week
  const getCycleDates = (createdAt: string | null) => {
    if (!createdAt) {
      return {
        startDate: "Loading...",
        endDate: "Loading...",
        daysRemaining: 0,
      };
    }

    const startDate = new Date(createdAt);
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const now = new Date();
    const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    return {
      startDate: startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      endDate: endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }),
      daysRemaining: daysRemaining,
    };
  };
  
  const cycleData = weekData ? {
    week: weekData.weekNumber,
    ...getCycleDates(weekData.createdAt),
  } : {
    week: 1,
    startDate: "Loading...",
    endDate: "Loading...",
    daysRemaining: 0,
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 card-glow animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Current Cycle
          </h2>
          <span className="font-mono text-xs text-primary">● LOADING</span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-mono text-4xl font-bold text-foreground opacity-50">Week --</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 opacity-50" />
            <span className="opacity-50">Loading dates...</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 opacity-50" />
            <span className="font-mono text-grind-amber opacity-50">-- days remaining</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-5 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Current Cycle
          </h2>
          <span className="font-mono text-xs text-destructive">● ERROR</span>
        </div>
        
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-mono text-2xl font-bold text-destructive">Error Loading</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="text-sm text-destructive">
            Failed to fetch current week data from GitHub.
          </div>
          <div className="text-xs text-muted-foreground">
            {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 card-glow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Current Cycle
        </h2>
        <span className="font-mono text-xs text-primary animate-pulse-subtle">● ACTIVE</span>
      </div>
      
      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-mono text-4xl font-bold text-foreground">Week {cycleData.week}</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{cycleData.startDate} — {cycleData.endDate}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="font-mono text-grind-amber">{cycleData.daysRemaining} days remaining</span>
        </div>
      </div>
    </div>
  );
};

export default CyclePanel;
