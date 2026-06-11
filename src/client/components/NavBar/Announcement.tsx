import { useAuth } from "wasp/client/auth";
import { routes } from "wasp/client/router";
import { Zap, Sparkles } from "lucide-react";
import { SubscriptionStatus } from "../../../payment/plans";

export function Announcement() {
  const { data: user } = useAuth();
  const isLoggedIn = !!user;
  const isPro = user?.subscriptionStatus === SubscriptionStatus.Active;

  // Pro user — hide announcement
  if (isPro) return null;

  if (isLoggedIn) {
    return (
      <div className="bg-primary text-primary-foreground relative flex w-full items-center justify-center gap-3 p-2.5 text-center text-sm font-medium">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span className="hidden lg:inline">
          Ready to generate? Open the tools dashboard.
        </span>
        <span className="lg:hidden">Open your tools dashboard.</span>
        <a
          href={routes.ToolsRoute.to}
          className="bg-primary-foreground/20 hover:bg-primary-foreground/30 cursor-pointer rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide transition-colors"
        >
          Open Tools →
        </a>
      </div>
    );
  }

  return (
    <div className="bg-primary text-primary-foreground relative flex w-full items-center justify-center gap-3 p-2.5 text-center text-sm font-medium">
      <Zap className="w-3.5 h-3.5 shrink-0" />
      <span className="hidden lg:inline">
        Free tier is truly unlimited — no credit card, no hidden limits.
      </span>
      <span className="lg:hidden">Free tier — unlimited AI tools, no card needed.</span>
      <a
        href={routes.SignupRoute.to}
        className="bg-primary-foreground/20 hover:bg-primary-foreground/30 cursor-pointer rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide transition-colors"
      >
        Start Free →
      </a>
    </div>
  );
}
