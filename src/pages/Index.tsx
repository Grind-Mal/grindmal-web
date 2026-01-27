import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";

import Header from "@/components/Header";
import CyclePanel from "@/components/CyclePanel";
import ActiveChallenge from "@/components/ActiveChallenge";
import OpenIssues from "@/components/OpenIssues";
import PRActivity from "@/components/PRActivity";
import CycleScoreboard from "@/components/CycleScoreboard";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <h1 className="font-mono text-3xl font-bold text-foreground mb-2">
            <span className="text-gradient">GrindMal</span> Dashboard
          </h1>
          <p className="text-muted-foreground">
            Weekly dev challenges. Real PRs. No fluff.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CyclePanel />
              <CycleScoreboard />
            </div>

            {/* Active Challenge */}
            <ActiveChallenge />

            {/* Issues and PRs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <OpenIssues />
              <PRActivity />
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-12">
        <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <span className="font-mono text-xs font-bold text-primary-foreground">GM</span>
            </div>
            <span className="font-mono text-sm text-muted-foreground">
              © 2026 GrindMal. Ship code or ship out.
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a 
              href="https://github.com/grindmal" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
