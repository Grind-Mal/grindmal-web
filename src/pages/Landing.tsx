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
  GitBranch,
  GitMerge,
  GitPullRequest,
  Code,
  Users,
  Target,
  Zap,
  Shield,
  MessageCircle,
  Send,
} from "lucide-react";
import logo from "@/assets/logo_transperant.png";

const principles = [
  {
    icon: Code,
    title: "Real Code, Real Impact",
    description:
      "No toy projects. Every challenge is a real tool that ships to production. Your PRs matter.",
  },
  {
    icon: Target,
    title: "Weekly Cadence",
    description:
      "One repo. One week. Focused sprints that build habits and ship features fast.",
  },
  {
    icon: Zap,
    title: "Zero Fluff",
    description:
      "No gamification theater. No fake badges. Just code, reviews, and merges.",
  },
  {
    icon: Shield,
    title: "Quality First",
    description:
      "Every PR goes through real code review. Learn from feedback. Ship better code.",
  },
];

const steps = [
  {
    icon: GitBranch,
    step: "01",
    title: "Pick an Issue",
    description:
      "Browse open issues labeled 'good first issue' or 'help wanted'. Find something that interests you.",
  },
  {
    icon: GitPullRequest,
    step: "02",
    title: "Submit a PR",
    description:
      "Fork the repo, write your code, and open a pull request. Follow the contribution guidelines.",
  },
  {
    icon: GitMerge,
    step: "03",
    title: "Get Reviewed & Merge",
    description:
      "Maintainers review your code. Address feedback, iterate, and get your code merged.",
  },
];

const stats = [
  { value: "12", label: "Challenges Completed" },
  { value: "156", label: "Active Contributors" },
  { value: "340+", label: "PRs Merged" },
  { value: "50+", label: "Issues Resolved" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="container py-16 md:py-24">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <img
              src={logo}
              alt="GrindMal Logo"
              className="w-40 h-40 md:w-52 md:h-52"
            />
            <div className="text-center md:text-left">
              <h1 className="font-mono text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                <span className="text-gradient">GrindMal</span> is where
                developers build real tools, together.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Weekly open-source challenges. Real repositories. Meaningful
                contributions. No tutorials, no hand-holding — just code that
                ships. Join the grind.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-card/50">
          <div className="container py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="font-mono text-4xl font-bold text-gradient">
                    {stat.value}
                  </span>
                  <p className="text-sm text-muted-foreground mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="container py-16 md:py-24">
          <h2 className="font-mono text-2xl font-bold text-foreground mb-8">
            Our Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="rounded-lg border border-border bg-card p-6 card-glow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                    <principle.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-mono text-lg font-semibold text-foreground">
                    {principle.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="border-y border-border bg-card/30">
          <div className="container py-16 md:py-24">
            <h2 className="font-mono text-2xl font-bold text-foreground mb-12 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={step.step} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent" />
                  )}
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mb-4">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <span className="font-mono text-xs text-primary mb-2">
                      {step.step}
                    </span>
                    <h3 className="font-mono text-lg font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Community */}
        <section className="container py-16 md:py-24">
          <div className="max-w-2xl mx-auto text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-mono text-2xl font-bold text-foreground mb-4">
              Join the Community
            </h2>
            <p className="text-muted-foreground mb-8">
              Connect with other grinders. Get announcements. Share your wins.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://discord.gg/grindmal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#5865F2] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <MessageCircle className="h-5 w-5" />
                Join Discord
              </a>
              <a
                href="https://t.me/grindmal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0088cc] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <Send className="h-5 w-5" />
                Join Telegram
              </a>
            </div>
          </div>
        </section>

        {/* Manifesto Quote */}
        <section className="border-t border-border">
          <div className="container py-16 md:py-24">
            <div className="max-w-2xl mx-auto text-center">
              <blockquote className="font-mono text-2xl md:text-3xl text-foreground italic mb-4">
                "Ship code or ship out."
              </blockquote>
              <cite className="text-primary font-mono">
                — The Grind Manifesto
              </cite>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
