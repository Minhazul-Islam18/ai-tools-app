import { Link } from "react-router";
import { useAuth } from "wasp/client/auth";
import { routes } from "wasp/client/router";
import {
  Image,
  ShoppingBag,
  Search,
  MessageSquare,
  Code2,
  FileText,
  PenLine,
  Crown,
  Zap,
} from "lucide-react";
import { SubscriptionStatus } from "../payment/plans";
import { cn } from "../client/utils";

interface Tool {
  name: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  freeLabel: string;
  proLabel: string;
  proOnly?: boolean;
  color: string;
}

const tools: Tool[] = [
  {
    name: "Image Generator",
    description: "Generate stunning images from text prompts",
    icon: <Image className="w-6 h-6" />,
    route: routes.ImageGeneratorRoute.to,
    freeLabel: "Pollinations (unlimited)",
    proLabel: "DALL-E 3 HD",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Product Description",
    description: "Write compelling ecommerce product descriptions",
    icon: <ShoppingBag className="w-6 h-6" />,
    route: routes.ProductDescRoute.to,
    freeLabel: "Llama 3.3 (unlimited)",
    proLabel: "GPT-4o + bulk",
    color: "from-blue-500 to-cyan-600",
  },
  {
    name: "SEO Meta Generator",
    description: "Generate optimized titles, descriptions & keywords",
    icon: <Search className="w-6 h-6" />,
    route: routes.SeoMetaRoute.to,
    freeLabel: "Llama 3.3 (unlimited)",
    proLabel: "GPT-4o + schema",
    color: "from-green-500 to-emerald-600",
  },
  {
    name: "Social Caption",
    description: "Write platform-perfect captions with hashtags",
    icon: <MessageSquare className="w-6 h-6" />,
    route: routes.SocialCaptionRoute.to,
    freeLabel: "Llama 3.3 (unlimited)",
    proLabel: "GPT-4o + platforms",
    color: "from-pink-500 to-rose-600",
  },
  {
    name: "Code Explainer",
    description: "Understand any code in plain English",
    icon: <Code2 className="w-6 h-6" />,
    route: routes.CodeExplainerRoute.to,
    freeLabel: "Llama 3.3 (unlimited)",
    proLabel: "GPT-4o",
    color: "from-orange-500 to-amber-600",
  },
  {
    name: "Text Summarizer",
    description: "Summarize long content into key points",
    icon: <FileText className="w-6 h-6" />,
    route: routes.SummarizerRoute.to,
    freeLabel: "Llama 3.3 (unlimited)",
    proLabel: "GPT-4o + long docs",
    color: "from-teal-500 to-cyan-600",
  },
  {
    name: "Blog Writer",
    description: "Generate full blog posts with SEO structure",
    icon: <PenLine className="w-6 h-6" />,
    route: routes.BlogWriterRoute.to,
    freeLabel: "Pro only",
    proLabel: "GPT-4o, 2000+ words",
    proOnly: true,
    color: "from-indigo-500 to-blue-600",
  },
];

export function ToolsDashboardPage() {
  const { data: user } = useAuth();
  const isPro = user?.subscriptionStatus === SubscriptionStatus.Active;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Tools</h1>
          <p className="text-muted-foreground">
            {isPro
              ? "Pro plan — GPT-4o powered generation"
              : "Free plan — unlimited generation with Llama 3.3 & Pollinations"}
          </p>
        </div>

        {/* Pro banner for free users */}
        {!isPro && (
          <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-800 p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-amber-500 shrink-0" />
              <p className="text-sm">
                <span className="font-medium">Upgrade to Pro</span> — unlock Blog Writer, DALL-E 3
                HD images, GPT-4o quality, and bulk generation.
              </p>
            </div>
            <Link
              to={routes.PricingPageRoute.to}
              className="shrink-0 px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors"
            >
              Upgrade
            </Link>
          </div>
        )}

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const locked = tool.proOnly && !isPro;
            return (
              <Link
                key={tool.name}
                to={tool.route}
                className={cn(
                  "group relative rounded-xl border bg-card p-6 transition-all duration-200",
                  "hover:shadow-md hover:-translate-y-0.5",
                  locked && "opacity-75"
                )}
              >
                {/* Gradient icon bg */}
                <div
                  className={cn(
                    "inline-flex p-3 rounded-xl bg-gradient-to-br text-white mb-4",
                    tool.color
                  )}
                >
                  {tool.icon}
                </div>

                {/* Pro badge */}
                {tool.proOnly && (
                  <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    <Crown className="w-3 h-3" />
                    Pro
                  </span>
                )}

                <h2 className="font-semibold text-foreground mb-1">{tool.name}</h2>
                <p className="text-sm text-muted-foreground mb-4">{tool.description}</p>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
                      Free
                    </span>
                    <span className="text-muted-foreground">{tool.freeLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
                      <Crown className="w-2.5 h-2.5" />
                      Pro
                    </span>
                    <span className="text-muted-foreground">{tool.proLabel}</span>
                  </div>
                </div>

                {!locked && (
                  <div className="mt-4 flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                    <Zap className="w-3 h-3" />
                    Open tool
                  </div>
                )}
                {locked && (
                  <div className="mt-4 flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <Crown className="w-3 h-3" />
                    Upgrade to unlock
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
