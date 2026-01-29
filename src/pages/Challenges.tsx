import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  ExternalLink,
  GitFork,
  Star,
  Calendar,
  Users,
  GitMerge,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAllChallenges, useCurrentWeekNumber } from "@/lib/github-api";
import { parseChallengeContent } from "@/lib/github-utils";

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

const statusStyles = {
  active: "bg-status-merged/20 text-status-merged border-status-merged/30",
  completed: "bg-muted text-muted-foreground border-border",
  upcoming:
    "bg-status-in-progress/20 text-status-in-progress border-status-in-progress/30",
};

const statusLabels = {
  active: "Active",
  completed: "Completed",
  upcoming: "Upcoming",
};

const Challenges = () => {
  const {
    data: githubChallenges,
    isLoading: challengesLoading,
    error: challengesError,
  } = useAllChallenges();
  const { data: weekData } = useCurrentWeekNumber();

  // Parse GitHub challenges into our format
  const currentWeekNumber = weekData?.weekNumber || 1;
  const challenges: Challenge[] = githubChallenges
    ? githubChallenges.map((githubChallenge) =>
        parseChallengeContent(githubChallenge, currentWeekNumber),
      )
    : [];

  if (challengesLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container py-8 flex-1">
          <div className="mb-8">
            <h1 className="font-mono text-3xl font-bold text-foreground mb-2">
              Weekly <span className="text-gradient">Challenges</span>
            </h1>
            <p className="text-muted-foreground">
              Loading challenges from GitHub...
            </p>
          </div>

          {/* Loading skeleton */}
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="rounded-lg border border-border bg-card p-6 animate-pulse"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-muted-foreground">
                        Week {index + 1}
                      </span>
                      <div className="h-6 w-16 rounded bg-muted"></div>
                    </div>

                    <div className="h-6 w-48 rounded bg-muted mb-2"></div>
                    <div className="h-4 w-full rounded bg-muted mb-3"></div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {[...Array(2)].map((_, tagIndex) => (
                        <div
                          key={tagIndex}
                          className="h-4 w-12 rounded bg-muted"
                        ></div>
                      ))}
                    </div>

                    <div className="h-4 w-32 rounded bg-muted"></div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2">
                    {[...Array(4)].map((_, statIndex) => (
                      <div
                        key={statIndex}
                        className="flex items-center gap-1.5 h-4 w-12 rounded bg-muted"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (challengesError) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container py-8 flex-1">
          <div className="mb-8">
            <h1 className="font-mono text-3xl font-bold text-foreground mb-2">
              Weekly <span className="text-gradient">Challenges</span>
            </h1>
            <p className="text-muted-foreground">
              Error loading challenges from GitHub
            </p>
          </div>

          <div className="rounded-lg border border-destructive bg-destructive/10 p-6">
            <h3 className="font-mono text-lg font-semibold text-destructive mb-2">
              Failed to load challenges
            </h3>
            <p className="text-sm text-destructive/80 mb-4">
              {challengesError instanceof Error
                ? challengesError.message
                : "Unknown error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

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

        {/* Challenges List */}
        <div className="space-y-4">
          {challenges.length > 0 ? (
            challenges.map((challenge) => (
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
                      <span className="font-mono text-xs text-muted-foreground">
                        Week {challenge.week}
                      </span>
                      <Badge
                        variant="outline"
                        className={statusStyles[challenge.status]}
                      >
                        {statusLabels[challenge.status]}
                      </Badge>
                    </div>

                    <h3 className="font-mono text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                      {challenge.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3">
                      {challenge.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {challenge.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {challenge.startDate} — {challenge.endDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end gap-4 md:gap-2 text-sm text-muted-foreground">
                    {/* <span className="flex items-center gap-1.5"> */}
                    {/*   <Star className="h-4 w-4" /> */}
                    {/*   {challenge.stars} */}
                    {/* </span> */}
                    {/* <span className="flex items-center gap-1.5"> */}
                    {/*   <GitFork className="h-4 w-4" /> */}
                    {/*   {challenge.forks} */}
                    {/* </span> */}
                    {/* <span className="flex items-center gap-1.5"> */}
                    {/*   <Users className="h-4 w-4" /> */}
                    {/*   {challenge.contributors} */}
                    {/* </span> */}
                    {/* <span className="flex items-center gap-1.5 text-status-merged"> */}
                    {/*   <GitMerge className="h-4 w-4" /> */}
                    {/*   {challenge.mergedPRs} */}
                    {/* </span> */}
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <p className="text-muted-foreground">No challenges found</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Challenges;
