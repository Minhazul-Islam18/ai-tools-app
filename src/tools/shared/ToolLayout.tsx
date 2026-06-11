import { Link } from "react-router";
import { ChevronLeft, Crown } from "lucide-react";
import { cn } from "../../client/utils";

interface ToolLayoutProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isPro?: boolean;
  proOnly?: boolean;
  isUserPro?: boolean;
  children: React.ReactNode;
}

export function ToolLayout({
  title,
  description,
  icon,
  isPro,
  proOnly,
  isUserPro,
  children,
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link
          to="/tools"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          All Tools
        </Link>

        <div className="flex items-start gap-4 mb-8">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">{icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{title}</h1>
              {proOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  <Crown className="w-3 h-3" />
                  Pro
                </span>
              )}
              {!proOnly && isUserPro && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  <Crown className="w-3 h-3" />
                  GPT-4o
                </span>
              )}
              {!proOnly && !isUserPro && (
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  Free
                </span>
              )}
            </div>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        {proOnly && !isUserPro ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800 p-8 text-center">
            <Crown className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h2 className="text-lg font-semibold mb-2">Pro Feature</h2>
            <p className="text-muted-foreground mb-4">
              Upgrade to Pro to unlock this tool with GPT-4o quality.
            </p>
            <Link
              to="/pricing"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-2 rounded-lg font-medium",
                "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              )}
            >
              <Crown className="w-4 h-4" />
              Upgrade to Pro
            </Link>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
