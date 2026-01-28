import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";

import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GitBranch, GitMerge, GitPullRequest, Code, Target, Zap, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const features = [
  {
    icon: Code,
    title: "Real Code, Real Impact",
    description: "No toy projects. Every challenge is a real tool that ships to production.",
  },
  {
    icon: Target,
    title: "Weekly Cadence",
    description: "One repo. One week. Focused sprints that build habits and ship features.",
  },
  {
    icon: Zap,
    title: "Zero Fluff",
    description: "No gamification theater. Just code, reviews, and merges.",
  },
  {
    icon: Shield,
    title: "Quality First",
    description: "Every PR goes through real code review. Ship better code.",
  },
];

const steps = [
  {
    icon: GitBranch,
    step: "01",
    title: "Pick an Issue",
    description: "Browse open issues and find something that interests you.",
  },
  {
    icon: GitPullRequest,
    step: "02",
    title: "Submit a PR",
    description: "Fork the repo, write your code, and open a pull request.",
  },
  {
    icon: GitMerge,
    step: "03",
    title: "Get Merged",
    description: "Address feedback, iterate, and get your code shipped.",
  },
];

const stats = [
  { value: "12", label: "Challenges" },
  { value: "156", label: "Contributors" },
  { value: "340+", label: "PRs Merged" },
  { value: "50+", label: "Issues Resolved" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="container py-20 md:py-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <img 
              src={logo} 
              alt="GrindMal Logo" 
              className="w-48 h-48 md:w-64 md:h-64 mb-8"
            />
            <h1 className="font-mono text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Do. Fail. Fix. <span className="text-gradient">Repeat.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl">
              Weekly open-source challenges where developers build real tools together. 
              No tutorials, no hand-holding — just code that ships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link to="/dashboard">
                  Enter Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/challenges">View Challenges</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-y border-border bg-card/50">
          <div className="container py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <span className="font-mono text-4xl font-bold text-gradient">{stat.value}</span>
                  <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container py-20">
          <h2 className="font-mono text-2xl font-bold text-foreground mb-12 text-center">
            The Grind Philosophy
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-card p-6 card-glow"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-mono text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="border-y border-border bg-card/30">
          <div className="container py-20">
            <h2 className="font-mono text-2xl font-bold text-foreground mb-12 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <div key={step.step} className="relative">
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-border to-transparent" />
                  )}
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/20 mb-4">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <span className="font-mono text-xs text-primary mb-2">{step.step}</span>
                    <h3 className="font-mono text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="container py-20">
          <div className="max-w-2xl mx-auto text-center">
            <blockquote className="font-mono text-2xl md:text-3xl text-foreground italic mb-6">
              "Ship code or ship out."
            </blockquote>
            <cite className="text-primary font-mono block mb-8">— The Grind Manifesto</cite>
            <Button asChild size="lg" className="gap-2">
              <Link to="/dashboard">
                Start Grinding
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Landing;
