import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

      <Footer />
    </div>
  );
};

export default Index;
