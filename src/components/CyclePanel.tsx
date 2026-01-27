import { Calendar, Clock } from "lucide-react";

const CyclePanel = () => {
  const cycleData = {
    week: 12,
    startDate: "Jan 20, 2026",
    endDate: "Jan 26, 2026",
    daysRemaining: 5,
  };

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
