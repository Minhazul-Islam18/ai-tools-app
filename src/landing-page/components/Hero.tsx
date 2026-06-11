import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Button } from "../../client/components/ui/button";
import { Sparkles, Zap } from "lucide-react";

export function Hero() {
  return (
    <div className="relative w-full pt-14">
      <TopGradient />
      <BottomGradient />
      <div className="md:p-24 pb-0">
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="lg:mb-18 mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="w-3.5 h-3.5" />
              Free tier — unlimited, no credit card needed
            </div>

            <h1 className="text-foreground text-5xl font-bold sm:text-6xl leading-tight">
              AI tools that{" "}
              <span className="text-gradient-primary italic">actually work</span>
              {" "}for free
            </h1>
            <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-8">
              Generate images, write product descriptions, create SEO meta tags, explain code, and more — all powered by best-in-class AI. Free tier costs you nothing, forever.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <Button size="lg" variant="default" asChild>
                <WaspRouterLink to={routes.SignupRoute.to}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start for Free
                </WaspRouterLink>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <WaspRouterLink to={routes.PricingPageRoute.to}>
                  View Pricing
                </WaspRouterLink>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No credit card · No limits on free tier · Upgrade anytime
            </p>
          </div>

          {/* Tool pills */}
          <div className="mt-16 flex flex-wrap justify-center gap-3">
            {[
              { emoji: "🖼️", name: "Image Generator" },
              { emoji: "🛍️", name: "Product Description" },
              { emoji: "🔍", name: "SEO Meta" },
              { emoji: "📱", name: "Social Caption" },
              { emoji: "💻", name: "Code Explainer" },
              { emoji: "📄", name: "Text Summarizer" },
              { emoji: "✍️", name: "Blog Writer" },
            ].map((tool) => (
              <span
                key={tool.name}
                className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm font-medium shadow-sm"
              >
                {tool.emoji} {tool.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TopGradient() {
  return (
    <div
      className="absolute right-0 top-0 -z-10 w-full transform-gpu overflow-hidden blur-3xl sm:top-0"
      aria-hidden="true"
    >
      <div
        className="aspect-1020/880 w-280 bg-linear-to-tr flex-none from-violet-400 to-cyan-300 opacity-10 sm:right-1/4 sm:translate-x-1/2 dark:hidden"
        style={{
          clipPath:
            "polygon(80% 20%, 90% 55%, 50% 100%, 70% 30%, 20% 50%, 50% 0)",
        }}
      />
    </div>
  );
}

function BottomGradient() {
  return (
    <div
      className="absolute inset-x-0 top-[calc(100%-40rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-65rem)]"
      aria-hidden="true"
    >
      <div
        className="aspect-1020/880 w-360 bg-linear-to-br relative from-violet-400 to-cyan-300 opacity-10 sm:-left-3/4 sm:translate-x-1/4 dark:hidden"
        style={{
          clipPath: "ellipse(80% 30% at 80% 50%)",
        }}
      />
    </div>
  );
}
