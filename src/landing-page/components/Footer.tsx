import { Sparkles } from "lucide-react";

interface NavigationItem {
  name: string;
  href: string;
}

export function Footer({
  footerNavigation,
}: {
  footerNavigation: {
    app: NavigationItem[];
    company: NavigationItem[];
  };
}) {
  return (
    <footer className="border-t border-border bg-muted/30 mt-24 w-full">
      <div className="w-full px-6 py-16 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <a href="/" className="inline-flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-primary group-hover:bg-primary/90 transition-colors">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                Gen<span className="text-primary">Kit</span>
              </span>
            </a>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
              AI-powered tools for creators, marketers, and developers. Free tier powered by Llama 3.3 & Pollinations — zero cost, real results.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-3">
                {footerNavigation.app.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                {footerNavigation.company.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row w-full">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GenKit. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a href="https://groq.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Groq</a>
            {" · "}
            <a href="https://pollinations.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Pollinations</a>
            {" · "}
            <a href="https://openai.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">OpenAI</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
