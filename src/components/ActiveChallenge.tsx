import { ExternalLink, GitFork, Star, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentWeekChallenge } from "@/lib/github-api";

// Helper function to parse challenge markdown content
const parseChallengeContent = (challengeData: {
  title: string;
  content: string;
  downloadUrl: string;
  repoUrl: string;
}) => {
  const lines = challengeData.content.split("\n");

  let title = challengeData.title;
  let description = "";
  const beginnerTasks: string[] = [];
  const intermediateTasks: string[] = [];
  const advancedTasks: string[] = [];

  let currentSection = "none";

  for (const line of lines) {
    if (line.startsWith("# ")) {
      title = line.replace("# ", "").trim();
    } else if (line.startsWith("## Beginner Task")) {
      currentSection = "beginner";
    } else if (line.startsWith("## Intermediate Task")) {
      currentSection = "intermediate";
    } else if (line.startsWith("## Advanced Task")) {
      currentSection = "advanced";
    } else if (line.startsWith("## Submission")) {
      currentSection = "submission";
    } else if (line.startsWith("---")) {
      currentSection = "none";
    } else if (
      currentSection === "none" &&
      line.trim() &&
      !line.startsWith("#")
    ) {
      if (description.length > 0) description += " ";
      description += line.trim();
    } else if (currentSection === "beginner" && line.trim().startsWith("-")) {
      beginnerTasks.push(line.trim().replace(/^- /, ""));
    } else if (
      currentSection === "intermediate" &&
      line.trim().startsWith("-")
    ) {
      intermediateTasks.push(line.trim().replace(/^- /, ""));
    } else if (currentSection === "advanced" && line.trim().startsWith("-")) {
      advancedTasks.push(line.trim().replace(/^- /, ""));
    }
  }

  // Generate README preview
  const readme = `
## ${title}

${description}

### Beginner Tasks
${beginnerTasks.map((task) => `- ${task}`).join("\n")}

### Intermediate Tasks  
${intermediateTasks.map((task) => `- ${task}`).join("\n")}

### Advanced Tasks
${advancedTasks.map((task) => `- ${task}`).join("\n")}

[View Full Challenge](${challengeData.downloadUrl})`;

  return {
    title,
    description: description || "No description available",
    readme,
    beginnerTasks,
    intermediateTasks,
    advancedTasks,
    downloadUrl: challengeData.downloadUrl,
    stars: 0, // Challenges don't have stars
    forks: 0, // Challenges don't have forks
    repoUrl: challengeData.repoUrl,
  };
};

const ActiveChallenge = () => {
  const { data: challengeData, isLoading, error } = useCurrentWeekChallenge();

  // Parse challenge content into sections
  const challenge = challengeData
    ? parseChallengeContent(challengeData)
    : {
        title: "Loading...",
        description: "Fetching current week challenge",
        readme: "Loading challenge details...",
        beginnerTasks: [],
        intermediateTasks: [],
        advancedTasks: [],
        repoUrl: "#",
        stars: 0,
        forks: 0,
      };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 card-glow card-glow-hover transition-all animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Active Challenge
            </h2>
            <div className="h-6 w-48 rounded bg-muted"></div>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span className="w-4 h-4 rounded bg-muted"></span>
            </span>
            <span className="flex items-center gap-1">
              <GitFork className="h-4 w-4" />
              <span className="w-4 h-4 rounded bg-muted"></span>
            </span>
          </div>
        </div>

        <div className="h-4 w-3/4 rounded bg-muted mb-4"></div>

        <div className="rounded-md bg-background border border-border p-4 mb-4 overflow-hidden">
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-muted"></div>
            <div className="h-3 w-5/6 rounded bg-muted"></div>
            <div className="h-3 w-4/6 rounded bg-muted"></div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            disabled
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <GitFork className="h-4 w-4 mr-2" />
            Loading...
          </Button>
          <Button
            disabled
            variant="outline"
            className="border-border text-foreground hover:bg-accent"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Loading...
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 card-glow card-glow-hover transition-all">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Active Challenge
            </h2>
            <h3 className="font-mono text-xl font-semibold text-destructive">
              Error Loading Challenge
            </h3>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Failed to fetch featured repository from GitHub. Please try again
          later.
        </p>

        <div className="rounded-md bg-background border border-border p-4 mb-4">
          <p className="font-mono text-xs text-muted-foreground">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <GitFork className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 card-glow card-glow-hover transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Active Challenge
          </h2>
          <h3 className="font-mono text-xl font-semibold text-foreground">
            {challenge.title}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Week Challenge
          </span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        {challenge.description}
      </p>

      <div className="rounded-md bg-background border border-border p-4 mb-4 overflow-hidden">
        <pre className="font-mono text-xs text-muted-foreground whitespace-pre-wrap overflow-x-auto">
          {challenge.readme}
        </pre>
      </div>

      <div className="flex gap-3">
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
