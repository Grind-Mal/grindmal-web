import { MessageCircle, Send, GitPullRequest, CheckCircle2, GitMerge, ArrowRight } from "lucide-react";

const steps = [
  { icon: GitPullRequest, label: "Pick an Issue", description: "Find a beginner-friendly task" },
  { icon: ArrowRight, label: "Submit a PR", description: "Write code, open a pull request" },
  { icon: CheckCircle2, label: "Review", description: "Get feedback, iterate" },
  { icon: GitMerge, label: "Merge", description: "Ship it, earn rep" },
];

const Sidebar = () => {
  return (
    <aside className="space-y-6">
      {/* Social Links */}
      <div className="rounded-lg border border-border bg-card p-5 card-glow">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          Community
        </h2>
        
        <div className="space-y-3">
          <a
            href="https://discord.gg/grindmal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md bg-[#5865F2]/10 border border-[#5865F2]/20 p-3 text-sm transition-all hover:bg-[#5865F2]/20 hover:border-[#5865F2]/40"
          >
            <MessageCircle className="h-5 w-5 text-[#5865F2]" />
            <div>
              <span className="font-medium text-foreground">Discord</span>
              <p className="text-xs text-muted-foreground">Announcements only</p>
            </div>
          </a>
          
          <a
            href="https://t.me/grindmal"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-md bg-[#0088cc]/10 border border-[#0088cc]/20 p-3 text-sm transition-all hover:bg-[#0088cc]/20 hover:border-[#0088cc]/40"
          >
            <Send className="h-5 w-5 text-[#0088cc]" />
            <div>
              <span className="font-medium text-foreground">Telegram</span>
              <p className="text-xs text-muted-foreground">Quick updates</p>
            </div>
          </a>
        </div>
      </div>

      {/* How It Works */}
      <div className="rounded-lg border border-border bg-card p-5 card-glow">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
          How It Works
        </h2>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.label} className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                <step.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                <p className="text-sm font-medium text-foreground">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grind Quote */}
      <div className="rounded-lg border border-border bg-gradient-to-br from-card to-background p-5">
        <blockquote className="font-mono text-sm text-muted-foreground italic">
          "Ship code or ship out."
        </blockquote>
        <cite className="mt-2 block font-mono text-xs text-primary">— The Grind Manifesto</cite>
      </div>
    </aside>
  );
};

export default Sidebar;
