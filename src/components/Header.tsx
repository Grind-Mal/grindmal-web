import { Github } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Challenges", href: "#challenges" },
  { name: "Issues", href: "#issues" },
  { name: "Leaderboard", href: "#leaderboard" },
  { name: "About", href: "#about" },
];

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <span className="font-mono text-sm font-bold text-primary-foreground">GM</span>
            </div>
            <span className="font-mono text-lg font-semibold tracking-tight text-foreground">
              GrindMal
            </span>
          </a>
          
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
        >
          <Github className="h-4 w-4" />
          <span className="hidden sm:inline">View on GitHub</span>
        </a>
      </div>
    </header>
  );
};

export default Header;
