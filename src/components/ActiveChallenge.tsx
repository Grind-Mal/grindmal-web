import { ExternalLink, GitFork, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const ActiveChallenge = () => {
  const challenge = {
    title: "grindmal-cli",
    description: "A minimal CLI tool for tracking daily dev grind sessions. Built with Go.",
    readme: `## Quick Start

\`\`\`bash
go install github.com/grindmal/grindmal-cli@latest
grindmal init
grindmal start --focus "feature/auth"
\`\`\`

### Features
- Session tracking with Pomodoro intervals
- Git integration for automatic commit summaries
- Discord/Telegram notifications`,
    stars: 127,
    forks: 34,
    repoUrl: "https://github.com/grindmal/grindmal-cli",
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5 card-glow card-glow-hover transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Active Challenge
          </h2>
          <h3 className="font-mono text-xl font-semibold text-foreground">{challenge.title}</h3>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            {challenge.stars}
          </span>
          <span className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            {challenge.forks}
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>

      <div className="rounded-md bg-background border border-border p-4 mb-4 overflow-hidden">
        <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap overflow-x-auto">
          {challenge.readme}
        </pre>
      </div>

      <div className="flex gap-3">
        <Button
          asChild
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <a href={challenge.repoUrl} target="_blank" rel="noopener noreferrer">
            <GitFork className="h-4 w-4 mr-2" />
            Fork Challenge
          </a>
        </Button>
        <Button
          variant="outline"
          asChild
          className="border-border text-foreground hover:bg-accent"
        >
          <a href={challenge.repoUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Repo
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ActiveChallenge;
