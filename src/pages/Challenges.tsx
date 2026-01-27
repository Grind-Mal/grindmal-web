import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExternalLink, GitFork, Star, Calendar, Users, GitMerge } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Challenge {
  id: number;
  week: number;
  title: string;
  description: string;
  status: "active" | "completed" | "upcoming";
  startDate: string;
  endDate: string;
  stars: number;
  forks: number;
  contributors: number;
  mergedPRs: number;
  repoUrl: string;
  tags: string[];
}

const challenges: Challenge[] = [
  {
    id: 1,
    week: 12,
    title: "grindmal-cli",
    description: "A minimal CLI tool for tracking daily dev grind sessions. Built with Go.",
    status: "active",
    startDate: "Jan 20, 2026",
    endDate: "Jan 26, 2026",
    stars: 127,
    forks: 34,
    contributors: 14,
    mergedPRs: 5,
    repoUrl: "https://github.com/grindmal/grindmal-cli",
    tags: ["Go", "CLI", "Productivity"],
  },
  {
    id: 2,
    week: 11,
    title: "rustmark",
    description: "Lightning-fast markdown parser written in Rust with WASM support.",
    status: "completed",
    startDate: "Jan 13, 2026",
    endDate: "Jan 19, 2026",
    stars: 256,
    forks: 67,
    contributors: 23,
    mergedPRs: 18,
    repoUrl: "https://github.com/grindmal/rustmark",
    tags: ["Rust", "WASM", "Parser"],
  },
  {
    id: 3,
    week: 10,
    title: "api-mock-server",
    description: "Zero-config API mock server for frontend development. JSON schema support.",
    status: "completed",
    startDate: "Jan 6, 2026",
    endDate: "Jan 12, 2026",
    stars: 189,
    forks: 45,
    contributors: 19,
    mergedPRs: 12,
    repoUrl: "https://github.com/grindmal/api-mock-server",
    tags: ["Node.js", "API", "Testing"],
  },
  {
    id: 4,
    week: 9,
    title: "git-cleanup",
    description: "Interactive git branch cleaner with safety checks and dry-run mode.",
    status: "completed",
    startDate: "Dec 30, 2025",
    endDate: "Jan 5, 2026",
    stars: 312,
    forks: 89,
    contributors: 31,
    mergedPRs: 24,
    repoUrl: "https://github.com/grindmal/git-cleanup",
    tags: ["Python", "Git", "DevOps"],
  },
  {
    id: 5,
    week: 13,
    title: "typesafe-env",
    description: "Type-safe environment variable validation for TypeScript projects.",
    status: "upcoming",
    startDate: "Jan 27, 2026",
    endDate: "Feb 2, 2026",
    stars: 0,
    forks: 0,
    contributors: 0,
    mergedPRs: 0,
    repoUrl: "https://github.com/grindmal/typesafe-env",
    tags: ["TypeScript", "Validation", "DX"],
  },
];

const statusStyles = {
  active: "bg-status-merged/20 text-status-merged border-status-merged/30",
  completed: "bg-muted text-muted-foreground border-border",
  upcoming: "bg-status-in-progress/20 text-status-in-progress border-status-in-progress/30",
};

const statusLabels = {
  active: "Active",
  completed: "Completed",
  upcoming: "Upcoming",
};

const Challenges = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-foreground mb-2">
            Weekly <span className="text-gradient">Challenges</span>
          </h1>
          <p className="text-muted-foreground">
            Ship real code. Build real tools. Every week, a new grind.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <span className="font-mono text-2xl font-bold text-foreground">12</span>
            <p className="text-xs text-muted-foreground mt-1">Total Challenges</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <span className="font-mono text-2xl font-bold text-status-merged">87</span>
            <p className="text-xs text-muted-foreground mt-1">PRs Merged</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <span className="font-mono text-2xl font-bold text-primary">156</span>
            <p className="text-xs text-muted-foreground mt-1">Contributors</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <span className="font-mono text-2xl font-bold text-grind-amber">884</span>
            <p className="text-xs text-muted-foreground mt-1">Total Stars</p>
          </div>
        </div>

        {/* Challenges List */}
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <a
              key={challenge.id}
              href={challenge.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-lg border border-border bg-card p-6 card-glow card-glow-hover transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-xs text-muted-foreground">Week {challenge.week}</span>
                    <Badge variant="outline" className={statusStyles[challenge.status]}>
                      {statusLabels[challenge.status]}
                    </Badge>
                  </div>
                  
                  <h3 className="font-mono text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {challenge.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {challenge.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{challenge.startDate} — {challenge.endDate}</span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4" />
                    {challenge.stars}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <GitFork className="h-4 w-4" />
                    {challenge.forks}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {challenge.contributors}
                  </span>
                  <span className="flex items-center gap-1.5 text-status-merged">
                    <GitMerge className="h-4 w-4" />
                    {challenge.mergedPRs}
                  </span>
                  <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Challenges;
