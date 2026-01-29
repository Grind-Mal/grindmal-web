import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  GitMerge,
  GitPullRequest,
  Trophy,
  Medal,
  Award,
  TrendingUp,
  GitCommit,
} from "lucide-react";
import { useOrganizationLeaderboard } from "@/lib/github-api";

interface Contributor {
  rank: number;
  name: string;
  username: string;
  avatar: string;
  initials: string;
  prsSubmitted: number;
  prsMerged: number;
  issuesClosed: number;
  commits: number;
  streak: number;
  topRepo: string;
}

const getInitialsFromUsername = (username: string): string => {
  if (!username) return "GH";

  const parts = username.split(/[-_]/);
  if (parts.length > 1) {
    return parts.map((part) => part[0].toUpperCase()).join("");
  }

  return username.slice(0, 2).toUpperCase();
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 3:
      return <Award className="h-5 w-5 text-amber-600" />;
    default:
      return (
        <span className="font-mono text-sm text-muted-foreground w-5 text-center">
          {rank}
        </span>
      );
  }
};

const Leaderboard = () => {
  const {
    data: leaderboardData,
    isLoading,
    error,
  } = useOrganizationLeaderboard();

  // Transform GitHub data to our component format
  const contributors: Contributor[] = leaderboardData
    ? leaderboardData.map((item: any) => ({
        rank: item.rank,
        name: item.username,
        username: item.username,
        avatar: item.avatar_url,
        initials: getInitialsFromUsername(item.username),
        prsSubmitted: item.prsSubmitted,
        prsMerged: item.prsMerged,
        issuesClosed: item.issuesClosed,
        commits: item.commits || 0,
        streak: item.streak,
        topRepo: item.topRepo,
      }))
    : [];

  const topThree = contributors.slice(0, 3);
  const rest = contributors.slice(3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container py-8 flex-1">
          <div className="mb-8">
            <h1 className="font-mono text-3xl font-bold text-foreground mb-2">
              <span className="text-gradient">Leaderboard</span>
            </h1>
            <p className="text-muted-foreground">
              Loading leaderboard data from GitHub...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Second Place Loading */}
            <div className="order-2 md:order-1 rounded-lg border border-border bg-card p-6 text-center md:mt-8 animate-pulse">
              <div className="h-8 w-8 mx-auto mb-3 bg-muted rounded"></div>
              <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-gray-400 bg-muted">
                <AvatarFallback className="bg-muted font-mono text-lg">
                  GH
                </AvatarFallback>
              </Avatar>
              <div className="h-6 w-3/4 mx-auto mb-1 rounded bg-muted"></div>
              <div className="h-4 w-1/2 mx-auto mb-3 rounded bg-muted"></div>
              <div className="flex justify-center gap-4 text-sm">
                <span className="h-4 w-12 rounded bg-muted"></span>
                <span className="h-4 w-12 rounded bg-muted"></span>
              </div>
            </div>

            {/* First Place Loading */}
            <div className="order-1 md:order-2 rounded-lg border-2 border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-card p-6 text-center animate-pulse">
              <div className="h-10 w-10 mx-auto mb-3 bg-muted rounded"></div>
              <Avatar className="h-20 w-20 mx-auto mb-3 border-2 border-yellow-500 bg-muted">
                <AvatarFallback className="bg-muted font-mono text-xl">
                  GH
                </AvatarFallback>
              </Avatar>
              <div className="h-6 w-3/4 mx-auto mb-1 rounded bg-muted"></div>
              <div className="h-4 w-1/2 mx-auto mb-3 rounded bg-muted"></div>
              <div className="flex justify-center gap-4 text-sm">
                <span className="h-4 w-12 rounded bg-muted"></span>
                <span className="h-4 w-12 rounded bg-muted"></span>
                <span className="h-4 w-12 rounded bg-muted"></span>
              </div>
            </div>

            {/* Third Place Loading */}
            <div className="order-3 rounded-lg border border-border bg-card p-6 text-center md:mt-12 animate-pulse">
              <div className="h-8 w-8 mx-auto mb-3 bg-muted rounded"></div>
              <Avatar className="h-14 w-14 mx-auto mb-3 border-2 border-amber-600 bg-muted">
                <AvatarFallback className="bg-muted font-mono">
                  GH
                </AvatarFallback>
              </Avatar>
              <div className="h-6 w-3/4 mx-auto mb-1 rounded bg-muted"></div>
              <div className="h-4 w-1/2 mx-auto mb-3 rounded bg-muted"></div>
              <div className="flex justify-center gap-4 text-sm">
                <span className="h-4 w-12 rounded bg-muted"></span>
                <span className="h-4 w-12 rounded bg-muted"></span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card overflow-hidden animate-pulse">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border bg-muted/50">
              <div className="col-span-1 h-4 rounded bg-muted"></div>
              <div className="col-span-3 h-4 rounded bg-muted"></div>
              <div className="col-span-2 h-4 rounded bg-muted"></div>
              <div className="col-span-2 h-4 rounded bg-muted"></div>
              <div className="col-span-2 h-4 rounded bg-muted"></div>
              <div className="col-span-1 h-4 rounded bg-muted"></div>
              <div className="col-span-1 h-4 rounded bg-muted"></div>
            </div>
            {Array(7)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-border last:border-0"
                >
                  <div className="col-span-1 flex justify-center">
                    <div className="h-4 w-4 rounded bg-muted"></div>
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <Avatar className="h-8 w-8 bg-muted">
                      <AvatarFallback className="bg-muted font-mono text-xs">
                        GH
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="h-3 w-3/4 rounded bg-muted mb-1"></div>
                      <div className="h-2 w-1/2 rounded bg-muted"></div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="h-4 w-8 mx-auto rounded bg-muted"></div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="h-4 w-8 mx-auto rounded bg-muted"></div>
                  </div>
                  <div className="col-span-2 text-center">
                    <div className="h-4 w-8 mx-auto rounded bg-muted"></div>
                  </div>
                  <div className="col-span-1 text-center">
                    <div className="h-4 w-8 mx-auto rounded bg-muted"></div>
                  </div>
                  <div className="col-span-1 text-center">
                    <div className="h-4 w-6 mx-auto rounded bg-muted"></div>
                  </div>
                </div>
              ))}
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="container py-8 flex-1">
          <div className="mb-8">
            <h1 className="font-mono text-3xl font-bold text-foreground mb-2">
              <span className="text-gradient">Leaderboard</span>
            </h1>
            <p className="text-muted-foreground">
              Error loading leaderboard data.
            </p>
          </div>

          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 mb-4">
            <p className="text-sm text-destructive mb-2">
              Failed to fetch leaderboard data from GitHub API.
            </p>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Unknown error occurred"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded text-sm"
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
            <span className="text-gradient">Leaderboard</span>
          </h1>
          <p className="text-muted-foreground">
            Top contributors this cycle. Ranked by merged PRs.
          </p>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Second Place */}
          <div className="order-2 md:order-1 rounded-lg border border-border bg-card p-6 text-center md:mt-8">
            <Medal className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <Avatar className="h-16 w-16 mx-auto mb-3 border-2 border-gray-400">
              <AvatarImage src={topThree[1]?.avatar} />
              <AvatarFallback className="bg-secondary font-mono text-lg">
                {topThree[1]?.initials}
              </AvatarFallback>
            </Avatar>
            <p className="font-mono text-lg font-semibold text-foreground">
              {topThree[1]?.name}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              @{topThree[1]?.username}
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-status-open">
                <GitCommit className="h-4 w-4" />
                {topThree[1]?.commits}
              </span>

              <span className="flex items-center gap-1 text-status-merged">
                <GitMerge className="h-4 w-4" />
                {topThree[1]?.prsMerged}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <GitPullRequest className="h-4 w-4" />
                {topThree[1]?.prsSubmitted}
              </span>
            </div>
          </div>

          {/* First Place */}
          <div className="order-1 md:order-2 rounded-lg border-2 border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-card p-6 text-center">
            <Trophy className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
            <Avatar className="h-20 w-20 mx-auto mb-3 border-2 border-yellow-500">
              <AvatarImage src={topThree[0]?.avatar} />
              <AvatarFallback className="bg-yellow-500/20 font-mono text-xl">
                {topThree[0]?.initials}
              </AvatarFallback>
            </Avatar>
            <p className="font-mono text-xl font-bold text-foreground">
              {topThree[0]?.name}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              @{topThree[0]?.username}
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-status-open">
                <GitCommit className="h-4 w-4" />
                {topThree[0]?.commits}
              </span>
              <span className="flex items-center gap-1 text-status-merged">
                <GitMerge className="h-4 w-4" />
                {topThree[0]?.prsMerged}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <GitPullRequest className="h-4 w-4" />
                {topThree[0]?.prsSubmitted}
              </span>
              {/* <span className="flex items-center gap-1 text-grind-amber"> */}
              {/*   <TrendingUp className="h-4 w-4" /> */}
              {/*   {topThree[0]?.streak}w */}
              {/* </span> */}
            </div>
          </div>

          {/* Third Place */}
          <div className="order-3 rounded-lg border border-border bg-card p-6 text-center md:mt-12">
            <Award className="h-8 w-8 text-amber-600 mx-auto mb-3" />
            <Avatar className="h-14 w-14 mx-auto mb-3 border-2 border-amber-600">
              <AvatarImage src={topThree[2]?.avatar} />
              <AvatarFallback className="bg-secondary font-mono">
                {topThree[2]?.initials}
              </AvatarFallback>
            </Avatar>
            <p className="font-mono text-lg font-semibold text-foreground">
              {topThree[2]?.name}
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              @{topThree[2]?.username}
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-status-open">
                <GitCommit className="h-4 w-4" />
                {topThree[2]?.commits}
              </span>
              <span className="flex items-center gap-1 text-status-merged">
                <GitMerge className="h-4 w-4" />
                {topThree[2]?.prsMerged}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <GitPullRequest className="h-4 w-4" />
                {topThree[2]?.prsSubmitted}
              </span>
            </div>
          </div>
        </div>

        {/* Rest of Leaderboard */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="col-span-1">Rank</div>
            <div className="col-span-3">Contributor</div>
            <div className="col-span-2 text-center">PRs Merged</div>
            <div className="col-span-2 text-center">PRs Submitted</div>
            <div className="col-span-2 text-center">Commits</div>
            <div className="col-span-1 text-center">Issues</div>
            {/* <div className="col-span-1 text-center">Streak</div> */}
          </div>

          {rest.map((contributor) => (
            <div
              key={contributor.username}
              className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-border last:border-0 hover:bg-accent transition-colors items-center"
            >
              <div className="col-span-1 flex justify-center">
                {getRankIcon(contributor.rank)}
              </div>
              <div className="col-span-3 flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={contributor.avatar} />
                  <AvatarFallback className="bg-muted font-mono text-xs">
                    {contributor.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {contributor.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    @{contributor.username}
                  </p>
                </div>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-mono text-sm text-status-merged font-semibold">
                  {contributor.prsMerged}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-mono text-sm text-muted-foreground">
                  {contributor.prsSubmitted}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="font-mono text-sm text-status-open">
                  {contributor.commits}
                </span>
              </div>
              <div className="col-span-1 text-center">
                <span className="font-mono text-sm text-muted-foreground">
                  {contributor.issuesClosed}
                </span>
              </div>
              {/* <div className="col-span-1 text-center"> */}
              {/*   <span className="font-mono text-sm text-grind-amber"> */}
              {/*     {contributor.streak}w */}
              {/*   </span> */}
              {/* </div> */}
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Leaderboard;
