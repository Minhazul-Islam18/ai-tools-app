import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { useAuth } from "wasp/client/auth";
import { HighlightedFeature } from "./components/HighlightedFeature";
import { Crown, Zap, Check } from "lucide-react";
import { SubscriptionStatus } from "../payment/plans";

export function AIReady() {
  return (
    <HighlightedFeature
      name="Two tiers. One goal: make you more productive."
      description="Free tier runs on state-of-the-art open-source models at zero cost. Upgrade to Pro when you need GPT-4o quality, longer outputs, or bulk generation."
      highlightedComponent={<TierComparison />}
      direction="row-reverse"
    />
  );
}

function TierComparison() {
  const { data: user } = useAuth();
  const isLoggedIn = !!user;
  const isPro = user?.subscriptionStatus === SubscriptionStatus.Active;

  const freeFeatures = [
    "Image generation (Pollinations / Flux)",
    "Product descriptions",
    "SEO meta tags",
    "Social captions",
    "Code explainer",
    "Text summarizer",
    "Powered by Llama 3.3 70B",
    "No daily limits",
  ];

  const proFeatures = [
    "Everything in Free",
    "DALL-E 3 HD images",
    "GPT-4o for all text tools",
    "Blog Writer (2000+ words)",
    "Longer, higher-quality outputs",
    "Priority generation",
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
      {/* Free card */}
      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30">
            <Zap className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">Free</p>
            <p className="text-xs text-muted-foreground">Forever free</p>
          </div>
        </div>
        <ul className="space-y-2">
          {freeFeatures.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <WaspRouterLink
          to={isLoggedIn ? routes.ToolsRoute.to : routes.SignupRoute.to}
          className="mt-4 block w-full text-center rounded-lg border py-2 text-sm font-medium hover:bg-muted transition-colors"
        >
          {isLoggedIn ? "Go to Tools" : "Get Started Free"}
        </WaspRouterLink>
      </div>

      {/* Pro card */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
            <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-semibold text-sm">Pro</p>
            <p className="text-xs text-muted-foreground">$9/mo or $79/yr</p>
          </div>
        </div>
        <ul className="space-y-2">
          {proFeatures.map((f) => (
            <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="w-3.5 h-3.5 text-primary shrink-0" />
              {f}
            </li>
          ))}
        </ul>
        <WaspRouterLink
          to={routes.PricingPageRoute.to}
          className="mt-4 block w-full text-center rounded-lg bg-primary text-primary-foreground py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {isPro ? "Manage Subscription" : "Upgrade to Pro"}
        </WaspRouterLink>
      </div>
    </div>
  );
}
