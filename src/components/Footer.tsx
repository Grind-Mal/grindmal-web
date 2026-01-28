import { Link } from "react-router-dom";
import logo from "@/assets/logo_transperant.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 mt-auto">
      <div className="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="GrindMal" className="h-10 w-10" />
            {/*<span className="font-mono text-xs font-bold text-primary-foreground">GM</span>*/}
            <span className="font-mono text-sm text-muted-foreground">
              © 2026 GrindMal. Ship code or ship out.
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy
          </a>
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
  );
};

export default Footer;
